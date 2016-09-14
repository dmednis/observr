#!/bin/bash
# This file is for setting up the development/vagrant environment

# Package installation

echo "----------Installing packages----------"

#repositories
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

apt-get update

#build dependencies
apt-get install -y build-essential tcl8.5

#nginx
apt-get install -y nginx

#nodejs
apt-get install -y nodejs

#redis
apt-get install -y redis-server

#postgres
apt-get install -y postgresql postgresql-contrib

apt-get clean

echo "----------Configuring environment----------"
#user
groupadd officer
useradd -g officer officer

#nginx
cp /vagrant/provision/config/nginx.conf /etc/nginx/nginx.conf
rm /etc/nginx/sites-available/default
rm /etc/nginx/sites-enabled/default
cp /vagrant/provision/config/vhost /etc/nginx/sites-available/officer
ln -s /etc/nginx/sites-available/officer /etc/nginx/sites-enabled/

service nginx restart

#postgres
#psql --username=postgres << EOF
#CREATE ROLE observr WITH SUPERUSER CREATEDB LOGIN PASSWORD 'qwerty1234';
#CREATE DATABASE observr_db OWNER observr ENCODING 'UTF8';
#EOF

#node
npm install -g nodemon bower gulp sequelize-cli
