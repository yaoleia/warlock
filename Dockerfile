FROM node:10.10.0

WORKDIR /warlock

RUN npm install pm2 yarn -g --registry=https://registry.npm.taobao.org
RUN yarn config set registry https://registry.npm.taobao.org -g

COPY . .

RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone 
RUN yarn
RUN npm run build

ENV SERVER_HOST UNSET
ENV SERVER_PORT UNSET

EXPOSE 7501

CMD [ "pm2-runtime", "yarn", "--", "start" ]