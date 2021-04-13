FROM postgres:13-alpine

# サーバーを日本時間に
RUN apk --update add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata && \
    rm -rf /var/cache/apk/*

RUN apk --update --no-cache add --virtual build-dependencies curl make gcc musl-dev postgresql-dev icu-dev \
    && cd /tmp \
    && curl -L -O https://ja.osdn.net/dl/pgbigm/pg_bigm-1.2-20200228.tar.gz \
    && tar zxfv pg_bigm-1.2-20200228.tar.gz \
    && cd pg_bigm-1.2-20200228 \
    && make USE_PGXS=1 \
    && make USE_PGXS=1 install \
    && echo "shared_preload_libraries = 'pg_bigm'" >> /usr/local/share/postgresql/postgresql.conf.sample \
    && rm -fr /tmp/pg_bigm-1.2-20200228 \
    && apk del --purge build-dependencies

# ローケルを日本時間に
ENV LANG ja_JP.UTF-8

ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 5432
CMD ["postgres"]