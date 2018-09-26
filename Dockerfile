FROM node:10.10.0

RUN npm install pm2 yarn -g --registry=https://registry.npm.taobao.org
RUN yarn config set registry https://registry.npm.taobao.org -g

WORKDIR /warlock

COPY package*.json ./

RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone 
RUN yarn

COPY . .

ENV SERVER_URL UNSET

RUN yarn build

EXPOSE 7001

CMD [ "pm2-runtime", "yarn", "--", "start" ]