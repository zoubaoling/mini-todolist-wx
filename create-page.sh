#! /bin/bash

# 创建页面

# 创建页面
mkdir -p "miniprogram/pages/$1"
cd "miniprogram/pages/$1"
touch "$1.wxml" "$1.less" "$1.ts" "$1.json"
echo "页面 $1 创建完成！"