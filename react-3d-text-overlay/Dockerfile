FROM node:12 as builder

# set working directory
RUN mkdir /app
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# RUN apt-get install autoconf automake libtool bash g++ libc6-compat libjpeg-turbo-dev libpng-dev

# install and cache app dependencies using yarn
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile --production
#RUN echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p

# Copy all frontend stuff to new "app" folder
COPY . /app/
#RUN ls -la
#RUN apt install libglu1 libxi-dev
#ENV PATH="/usr/local/bin:/app/node_modules/.bin:${PATH}"

RUN yarn build

FROM mhart/alpine-node:12

COPY --from=builder /app/build /build

WORKDIR /build
RUN yarn global add serve

EXPOSE 8000

ENTRYPOINT [ "serve", "-p", "8000" ]

#ENTRYPOINT ["gatsby"]
#CMD ["serve", "--host", "0.0.0.0", "--port", "8000"]

#ENTRYPOINT ["./entry.sh"]