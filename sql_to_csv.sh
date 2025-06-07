#!/bin/bash
# Usage: ./sql_to_csv.sh db_name table_name
DB="$1"
TABLE="$2"
psql -d "$DB" -c "\COPY $TABLE TO STDOUT WITH CSV HEADER" > "${TABLE}.csv"
