ip=$(curl http://checkip.amazonaws.com)
echo "Preview URL"
echo "http://$ip:8080"
echo "SQLite DB Web URL"
echo "http://$ip:8000"
