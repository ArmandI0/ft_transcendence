# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: nledent <nledent@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/06/17 12:10:05 by kprigent          #+#    #+#              #
#    Updated: 2024/09/24 14:42:46 by nledent          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#include srcs/requirements/vault/conf/.env
# export $(shell sed 's/=.*//' .env)

# Couleurs
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;93m
BLUE=\033[1;94m
NC=\033[0m # No Color

# Règles
all: config start postconfig

config :
	./preconfig.sh

postconfig :
	./postconfig.sh
	
# Lancer les containers un par un
start:
	@echo "${YELLOW}Lancement des containers...${NC}"
	@docker compose -f srcs/docker-compose.yml up --build -d
	@echo "${GREEN}Containers lancés.${NC}"
	@echo "${YELLOW}"
	@echo " _____                                        _ "
	@echo "/__   \\_ __ __ _ _ __  ___  ___ ___ _ __   __| | __ _ _ __   ___ ___ "
	@echo "  / /\\  '__/ _\` | '_ \\/ __|/ __/ _ \\ '_ \\ / _\` |/ _\` | '_ \\ / __/ _ \\"
	@echo " / /  | | | (_| | | | \\__ \\ (_|  __/ | | | (_| | (_| | | | | (_|  __/"
	@echo " \\/   |_|  \\__,_|_| |_|___/\\___\\___|_| |_|\\__,_|\\__,_|_| |_|\\___\\___|"
	@echo "${NC}"
	@echo "${BLUE}-> Transcendance website :${NC} https://localhost"
	@echo "${BLUE}-> Prometheus :${NC} https://localhost:9090"

debug:
	@echo "${YELLOW}Lancement des containers...${NC}"
	@docker compose -f srcs/docker-compose.yml up --build
	@echo "${GREEN}Containers lancés.${NC}"
	@echo "${YELLOW}"
	@echo " _____                                        _ "
	@echo "/__   \\_ __ __ _ _ __  ___  ___ ___ _ __   __| | __ _ _ __   ___ ___ "
	@echo "  / /\\  '__/ _\` | '_ \\/ __|/ __/ _ \\ '_ \\ / _\` |/ _\` | '_ \\ / __/ _ \\"
	@echo " / /  | | | (_| | | | \\__ \\ (_|  __/ | | | (_| | (_| | | | | (_|  __/"
	@echo " \\/   |_|  \\__,_|_| |_|___/\\___\\___|_| |_|\\__,_|\\__,_|_| |_|\\___\\___|"
	@echo "${NC}"
	@echo "${BLUE}-> Transcendance website :${NC} https://localhost"
	@echo "${BLUE}-> Prometheus :${NC} https://localhost:9090"


# Arrêter les containers

stop:
	@echo "${RED}Arrêt des containers...${NC}"
	@docker compose -f srcs/docker-compose.yml down
	@echo "${GREEN}Containers arrêtés.${NC}"

# Arrêter les containers et nettoyer le système Docker

remove:
	@echo "${RED}Arrêt des containers...${NC}"
	@docker compose -f srcs/docker-compose.yml down
	@docker volume prune -f
	@docker network prune -f
	@docker image prune -f
	@if docker volume srcs_postgres_data >/dev/null 2>&1; then \
		@docker volume rm srcs_postgres_data ;\
	fi
	@if [ -n "$$(docker images -a -q)" ]; then \
		echo "Suppression des images Docker..."; \
		docker rmi -f $$(docker images -a -q); \
	else \
		echo "Aucune image Docker à supprimer."; \
	fi
	@echo "${GREEN}Nettoyage du système Docker terminé.${NC}"

# Recréation complète (nettoyer + tout refaire)

re: stop all

del_vol:
	sudo docker compose -f srcs/docker-compose.yml down
	if [ -f .config_ok ]; then \
		sudo rm .config_ok;\
	fi
	sudo docker volume rm postgres_data
	sudo docker volume rm vault_data
	sudo rm -rf vault_data
	sudo rm -rf postgres_data	

reset:
	sudo docker compose -f srcs/docker-compose.yml down
	sudo docker system prune -af
	if [ -f .config_ok ]; then \
		sudo rm .config_ok;\
	fi
	sudo docker volume rm postgres_data
	sudo docker volume rm vault_data
	sudo rm -rf vault_data
	sudo rm -rf postgres_data	

.PHONY: all setup clean start debug stop remove re reset config postconfig del_vol
