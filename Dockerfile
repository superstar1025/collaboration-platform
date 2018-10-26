FROM omalab/nodebox:0.1.2

ENV APP_DIR /var/app/react-app
# set working directory
RUN set -ex \
    && mkdir -p $APP_DIR

EXPOSE 8080 5000

WORKDIR $APP_DIR

# add `/usr/src/node_modules/.bin` to $PATH
ENV PATH $APP_DIR/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json $APP_DIR/package.json
RUN yarn install

# start app
CMD ["./bin/init.sh"]
