sudo docker pull registry.gitlab.com/jonathan-m-borges/jmborges.site:rest-api-employees
sudo docker stop rest_api_employees
sudo docker rm rest_api_employees
sudo docker run --name rest_api_employees -d -p 5000:5000 --restart always --link mongo registry.gitlab.com/jonathan-m-borges/jmborges.site:rest-api-employees