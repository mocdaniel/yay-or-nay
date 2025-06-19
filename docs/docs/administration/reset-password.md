# Resetting Your Password

In case you forgot or lost your password and need to reset it, you can do so by updating the `password_hash` column in the database.

Follow these steps:

1. Generate an `Argon2id` hash of your new password using the [Argon2 playground](https://node-rs.dev/). Make sure to set the following settings:

    - `Argon2id`
    - `Time cost` >= `2`

2. Copy the generated hash.
3. Enter the following command on the system where the database runs in Docker:

    ```bash
    docker exec -i <container_name> echo "UPDATE users SET password_hash='<hash>' WHERE id = 1" \
      | psql -U <user> -d <database>
    ```

    Substitute `container_name`, `user`, and `database` for the values configured in your `compose.yaml`, and `hash` for the generated hash from step 2.
