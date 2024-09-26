while [ "$(curl -s -o /dev/null -w "%{http_code}" http://vault:8200/v1/sys/health?standbyok=true)" -ne 200 ]; 
do sleep 1; 
done

./prometheus --config.file=/prometheus/prometheus.yml
