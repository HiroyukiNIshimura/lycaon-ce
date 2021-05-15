# lycaon-ce

Lycaon is a cloud-based support tool for teaming up to achieve something. It can be used not only for project and system development support, but also for communication in school classes, document linkage, work procedure manuals in factory lines, etc.

Lycaonは、チームを組んで何かを達成するためのクラウド型支援ツールです。プロジェクトやシステム開発の支援に限らず、学校のクラス内でのコミュニケーションやドキュメント連携、工場ライン内での作業手順マニュアルなどにもご利用できます。

[Click here for details](https://www.lycaon-cloud.com/)

![shot-1.png](/images/shot-1.png)

![shot-2.png](/images/shot-2.png)

## Installation

With [node](https://nodejs.org/en/) [installed:](https://nodejs.org/en/download/)　Please use LTS

```
# Get the Sails Framework and install the package

$ npm install sails@1.4.0 -g
$ npm install @sailshq/lodash -g
$ cd src
$ npm install
```

## DB Connection settings
### Datastores

src/config/datastores.js
```
url: "postgresql://user:password@server:5433/lycaondb",
```

### Session Configuration

src/config/session.js
```
url: 'redis://server:6380/0',
```

### WebSocket Server Settings

src/config/sockets.js
```
url: 'redis://server:6380/1',
```

### Agenda jobs Mopngodb Settings

src/config/custom.js
```
agenda: {
    ...
    mongoUrl: 'mongodb://server:27017/lycaon-job-db',
```

## Lift application

```
$ cd src
$ sails lift
```

## Backbone DB Docker container sample

```
$ cd backbone-sample
$ docker-compose build
$ docker-compose up -d
```

## Demo site

https://lycaondemo.bright-l.0am.jp

User: demoo@example.com
Password: lycaon4321

> The data on this site will be deleted with each version upgrade.



