# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: kprigent <kprigent@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/06/17 12:10:05 by kprigent          #+#    #+#              #
#    Updated: 2024/08/05 17:49:30 by kprigent         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DATA_DIR=database/web

# Couleurs
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;93m
BLUE=\033[1;94m
NC=\033[0m # No Color

# Règles
all: setup start

# Création des répertoires nécessaires
setup:
	@echo "${BLUE}Création des répertoires...${NC}"
	mkdir -p $(DATA_DIR)
	@echo "${GREEN}Les répertoires ont été créés avec succès.${NC}"

# Suppression des répertoires
clean:
	@echo "${RED}Suppression des répertoires...${NC}"
	@sudo rm -rf $(MYSQL_DIR)
	@echo "${GREEN}Les répertoires ont été supprimés avec succès.${NC}"

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
	@echo "${BLUE}-> Transcendance website :${NC} http://localhost"
	@echo "${BLUE}-> Prometheus :${NC} http://localhost:9090"
	


# Arrêter les containers
stop:
	@echo "${RED}Arrêt des containers...${NC}"
	@docker compose -f srcs/docker-compose.yml down
	@echo "${GREEN}Containers arrêtés.${NC}"

# Arrêter les containers et nettoyer le système Docker
stopC: clean
	@echo "${RED}Arrêt des containers...${NC}"
	@docker compose -f srcs/docker-compose.yml down
	@echo "${GREEN}Containers arrêtés.${NC}"
	@docker volume rm srcs_web > /dev/null 2>&1
	@echo "${RED}Nettoyage du système Docker...${NC}"
	@docker system prune -a -f > /dev/null 2>&1
	@echo "${GREEN}Nettoyage du système Docker terminé.${NC}"

# Recréation complète (nettoyer + tout refaire)
re: stop all

.PHONY: all setup clean start stop stopC re
