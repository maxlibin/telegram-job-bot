## Telegram job board for google cloud

## How to install
config your env in app.yaml, and run
```
yarn install
```

```
yarn dev
```

Google cloud will stop their instance if no traffic for the last 15 mins, cron,yaml will create a cron job to ping google cloud every 10 minutes, this will help the instance to stay alive.