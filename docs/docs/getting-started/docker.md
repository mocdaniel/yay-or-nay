# Deploying on Docker

Yay Or Nay has been designed with [Docker](https://docker.com) as primary deployment target.

Images for deployment are available for **all tags/releases** as well as the current `HEAD` of the `main`
branch as `latest` image.

## Prerequisites

**Clone the repository** or **download** the `compose.yaml` file [from the repository](https://github.com/mocdaniel/yay-or-nay/blob/main/compose.yaml).

```bash
git clone https://github.com/mocdaniel/yay-or-nay
cd yay-or-nay
```

In addition, you will need [Docker](https://docs.docker.com/engine/install/) and its `compose` plugin, which these days
_should_ come with the Docker installation.

## Configuring Yay Or Nay

Once you have a local copy of `compose.yaml`, change the lines as indicated by clicking the (1) icons:
{ .annotate }

1. Like this.

``` yaml
services:
  yay-or-nay:
    container_name: yay-or-nay
    depends_on:
      - postgres
    environment:
      POSTGRES_URL: postgres://postgres:postgres@postgres:5432/yay_or_nay # (3)!
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://$${HOSTNAME}:3000/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    image: yay-or-nay:latest
    ports:
      - "3000:3000"
    restart: unless-stopped

  postgres:
    container_name: yay-or-nay-postgres
    environment:
      POSTGRES_PASSWORD: "postgres" # (1)!
      POSTGRES_USER: "postgres" # (2)!
      POSTGRES_DB: "yay_or_nay"
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    image: postgres:16
    restart: unless-stopped
    volumes:
      - yay-or-nay-data:/var/lib/postgresql/data

volumes:
  yay-or-nay-data: {}
```

1. Set a custom password
2. Set a custom user (optional)
3. Update the `POSTGRES_URL` string to contain the set username and password

## Deploying Yay Or Nay

Once you adjusted `compose.yaml` to your liking, deploy the stack with Docker like this:

```bash { .copy }
docker compose up -d
```

You can check whether the deployment was successful using

```bash { .copy }
docker compose ps
```

## Logging In to Yay Or Nay for the First Time

Yay Or Nay allows **only one user** to be registered. After deploying the application, navigate to [localhost:3000/signup](http://localhost:3000/signup) in your browser, and set a username and password.
