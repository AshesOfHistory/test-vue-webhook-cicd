#!/bin/bash
WORK_PATH='/www/wwwroot/projects/test-vue-front-cicd'
cd $WORK_PATH
echo "先清除老代码"
git reset -f --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "编译"
npm run build
echo "开始执行构建前端镜像"
docker build -t test-vue-front-cicd:1.0 .
echo "停止旧容器并删除旧容器"
docker stop test-vue-front-cicd-container
docker rm test-vue-front-cicd-container
echo "启动新容器"
docker container run -p 80:80 --name test-vue-front-cicd-container -d test-vue-front-cicd:1.0