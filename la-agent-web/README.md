# 说明文档

## pnpm

pnpm:>=v8.5.0

## node

node:>v16.20.2

## Getting Started

### 项目架构

为贴合项目需要，前端采用pnpm管理的monorepo架构

### 文件夹说明

- packages该文件夹下主要放置整个项目抽取出来的公共的代码

- apps该文件夹下放置web项目

- docs该文件夹放置项目说明文档

## 命令

### 安装依赖

- 单独安装单独为某一个包安装依赖，请使用： pnpm --filter '需要单独安装的项目名' i -S/-D 'npm包装'

- 全局依赖全局依赖安装：pnpm i -wS '包名' pnpm i -wD '包名',直接更改package.json文件后,需要执行pnpm -w i,更新
  node_modules依赖

### 基础

- install pnpm i 会安装好整个项目的依赖

- dev pnpm dev 会运行apps文件夹下所有项目

- dev:packages会运行packages下的项目
