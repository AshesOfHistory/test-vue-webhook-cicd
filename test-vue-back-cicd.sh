#!/bin/bash
WORK_PATH='/www/wwwroot/projects/test-vue-back-cicd'
cd $WORK_PATH
echo "先清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull
echo "开始执行构建后台镜像"
docker build -t test-vue-back-cicd:1.0 .
echo "停止旧容器并删除旧容器"
docker stop test-vue-back-cicd-container
docker rm test-vue-back-cicd-container
echo "启动新容器"
docker container run -p 3100:3100 --name test-vue-back-cicd-container -d test-vue-back-cicd:1.0