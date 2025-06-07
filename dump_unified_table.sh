#!/bin/bash
# Usage: ./dump_unified_table.sh db_name table_name
DB="$1"
TABLE="$2"
mkdir -p merged_dumps
pg_dump -t "$TABLE" -f "merged_dumps/${TABLE}.sql" "$DB"
