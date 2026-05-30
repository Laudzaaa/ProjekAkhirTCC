# Deploy backend to App Engine (Cloud SQL)

Steps to deploy the `backend/` service to App Engine and connect it to Cloud SQL.

Prerequisites
- `gcloud` CLI installed and authenticated (`gcloud auth login`).
- Project set: `gcloud config set project YOUR_PROJECT_ID`.
- Cloud SQL Admin API enabled.
- A Cloud SQL (MySQL) instance created, with a database and user.

1. (Optional) Create App Engine app (run once per project):

```bash
gcloud app create --project=YOUR_PROJECT_ID --region=asia-southeast2
```

2. If you want to use the Cloud SQL Unix socket (recommended for private IP or standard env):
- Note the connection name `PROJECT:REGION:INSTANCE`.
- Update `backend/app.yaml` `beta_settings.cloud_sql_instances` and set `CLOUD_SQL_CONNECTION_NAME` env var.

3. For current repository which uses a public IP DB (quick deploy):
- Ensure `backend/app.yaml` has DB_HOST pointing to the DB public IP and correct DB credentials (already present in repo .env for quick testing).

---

Advanced: Create Cloud SQL, migrate data, and use Secret Manager (recommended)

1. Create a Cloud SQL instance (MySQL 8):

```bash
gcloud sql instances create perpus-instance --database-version=MYSQL_8_0 --region=asia-southeast2 --tier=db-f1-micro
```

2. Create database and user:

```bash
gcloud sql databases create perpustakaan_db --instance=perpus-instance
gcloud sql users create perpustakaan --instance=perpus-instance --password='CHANGE_ME'
```

3. Note the connection name (used by App Engine socket):

```bash
gcloud sql instances describe perpus-instance --format='value(connectionName)'
# Example output: project-id:asia-southeast2:perpus-instance
```

4. Migrate existing data (if you have a dump):

```bash
# From a machine with mysql client and network access to the instance public IP
mysqldump -u old_user -p old_db | mysql -h PUBLIC_IP -u perpustakaan -p perpustakaan_db
```

5. Store DB password in Secret Manager (recommended):

```bash
echo -n 'NEW_DB_PASSWORD' | gcloud secrets create DB_PASSWORD_SECRET --data-file=- --replication-policy='automatic'
gcloud secrets add-iam-policy-binding DB_PASSWORD_SECRET --member=serviceAccount:e-31-489014@appspot.gserviceaccount.com --role=roles/secretmanager.secretAccessor
```

6. Update `backend/app.yaml` to set `beta_settings.cloud_sql_instances` to the connection name and either:

- Use the `secrets` mapping (App Engine standard):

	```yaml
	beta_settings:
		cloud_sql_instances: project-id:asia-southeast2:perpus-instance

	secrets:
	- secret: projects/YOUR_PROJECT_ID/secrets/DB_PASSWORD_SECRET
		version: latest
		env: DB_PASSWORD
	```

- Or set `CLOUD_SQL_CONNECTION_NAME` env variable and keep `DB_PASSWORD` from Secret Manager via runtime fetch.

7. Deploy the app (App Engine will mount the socket):

```bash
cd backend
gcloud app deploy app.yaml --project=YOUR_PROJECT_ID
```

8. After deploy, verify logs and tail:

```bash
gcloud app browse --project=YOUR_PROJECT_ID
gcloud app logs tail -s default --project=YOUR_PROJECT_ID
```

Security notes
- Rotate the DB password after migration and update Secret Manager. Avoid committing secrets into the repo.
- Grant the App Engine service account `roles/cloudsql.client` and `roles/secretmanager.secretAccessor` for proper access.
4. Deploy to App Engine:

```bash
cd backend
gcloud app deploy app.yaml --project=YOUR_PROJECT_ID
```

5. Verify logs and service URL:

```bash
gcloud app browse --project=YOUR_PROJECT_ID
gcloud app logs tail -s default --project=YOUR_PROJECT_ID
```

6. Update frontend after App Engine URL is known:
- Set `REACT_APP_API_URL=https://<YOUR_APP_ENGINE_SERVICE>-dot-<PROJECT_ID>.uc.r.appspot.com/api` in `digital-library-frontend/.env.production` or via hosting config.
- Rebuild frontend and deploy.

Notes
- If using `beta_settings.cloud_sql_instances`, App Engine standard will mount the socket and `backend/config/database.js` already supports `DB_SOCKET_PATH` or `CLOUD_SQL_CONNECTION_NAME`.
- If you prefer Cloud Run, the repository already has a working Cloud Run deployment at `https://digital-library-backend-132702792159.asia-southeast2.run.app`.
