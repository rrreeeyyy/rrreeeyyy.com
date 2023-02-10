---
title: '#9 phpのsession storeをredisにする'
author: rrreeeyyy
categories:
  - 未分類
pubDate: 2012/06/12
---
こんにちわ。れいです。

今日はphpのsession storeをredisにしてみようと思います。

<!--more-->

負荷分散するときに、セッション、どうしてますか？
keepalivedやapacheのmod\_proxy\_balancerを使ってバランシングする時に、
バックエンドのAPサーバでセッションを管理していると、困りますよね。

従来は、DBやnfsやmemcachedやrepcachedに入れる方法が主流でしたね。
でも、ちょっと遅かったり再起動をしたら消えてしまったり負荷が心配だったり&#8230;
といくつか問題があったようにも思います。

そこで、最近流行りのKVSにphpのセッションを入れて
管理する方法を紹介します。
今回使うのはRedisです。
色んなKVSの中でかなり早い部類に入るのと、
レプリケーションを組むのが非常に簡単であること、
あと僕が使ったことがあるKVSがMongoDBとRedisしかないので、
なんとなく選びました。
(余談ですが、TopotalではRedisを使っています)

phpとRedisのインストールは、もっと詳細に紹介している他サイトさんがあると思うので、
そこに任せます。
(需要があったら書きます)

phpとredisはインストール済みとして話を進めます。
まず、phpでredisを使うために、
phpredisを入れます。
→phpredis( [http://github.com/owlient/phpredis][1] )

多分phpizeが要ります。

```
# git clone https://github.com/owlient/phpredis.git
# cd phpredis
# phpize
# ./configure
```

僕はphpをソースからインストールしていたので、
php-configがどこにあるか指定しろのエラーが出ました。
ので、以下のようにしました。

```
# ./configure --with-php-config=/usr/local/php/bin/php-config
# make
# make install
```

これで終わりです。
php-fpmを使っていたのでrestartしておきました。
apacheを使っている人はapacheをrestartしておくと、
よいかもしれません。

phpとredisが正常に連携できているか調べるために、
こんな感じのことをしました。
[php]php -r &#8216; $redis = new Redis();
$redis->connect(&#8220;127.0.0.1&#8243;,6379);
$redis->set(&#8220;redis-test&#8221;,&#8221;test&#8221;);
echo $redis->get(&#8220;redis-test&#8221;); &#8216;[/php]
これで、test と表示されればOKです。
(redisが127.0.0.1:6379で待ち受けていることが必要です。)

次に、php.iniの設定をします。
普通は/etc/php.iniとかに入ってるような気がします。

```
# vim /usr/local/php/lib/php.ini
```

```
extension=redis.so
```

の記述があることを確認します。無ければ追記します。
(ないと多分phpとredisの連携テストでこけますが…)

次に、session.save_handlerを以下のように変更します。

```
session.save_handler = redis
```

そして、session.save_pathを例えばこんな感じに書きます。

```
session.save_path = "tcp://127.0.0.1:6379?weight=1"
```

基本的な記法は、

```
tcp://${HOST_ADDRESS}:${HOST_PORT}?${OPTION1}&#038;${OPTION2}...
```

のような感じです。

使えるオプションは、

```
weight
timeout
persistent
prefix
auth
```

にだと思います。
・weight
weight=INT で指定して、複数のサーバにバランシングすることが出来るみたいです。
デフォルト値は1になってます。
・timeout
timeout=FLOAT で指定して、redisサーバとのタイムアウト値を設定します。
デフォルト値は86400と長いです。
・persistent
0か1を指定出来ます、が、ちょっとちゃんと動いてるか検証出来なかった上に、
公式で実験的な設定というふうな記述があるので、今は触らないほうがいいでしょう。
・prefix
prefix=STRINGで指定して、redisにsessionを格納する際のkey値を指定できます。
デフォルトは&#8221;PHPREDIS_SESSION:&#8221;になってます。
・auth
redis-serverでAUTHが設定されてる時に設定します。
デフォルトは設定されてません。

3つのサーバにsessionをバランシングしたい時は、次のように書くのがいいでしょう。

```
session.save_path = "tcp://10.0.0.1:6379?weight=1&#038;timeout=3.0,tcp://10.0.0.2:6379?weight=2&#038;timeout=3.0,tcp://10.0.0.3:6379?weight=2&#038;timeout=3.0"
```

こーんなテストページを作って、実際にSESSIONが入ってるか見てみましょう。

``` php
<?php
session_start();
if (isset( $_SESSION["count"] )) {
	$_SESSION["count"]++;
}else{
	$_SESSION["count"] = 1;
}
?>;




<?php echo htmlspecialchars($_SESSION["count"]) ?>


```

redis-cliに入って、monitorコマンドを実行して、ページにアクセスしてみましょう。

```
[root@coco-01 ~]# redis-cli
redis 127.0.0.1:6379>; monitor
OK
"monitor"
```

作ったテストページに実際にアクセスしてみると、こんな感じになります。

```
"GET" "PHPREDIS_SESSION:~~~~~"
"SETEX" "PHPREDIS_SESSION:~~~~~" "1440" "count|i:2;"
```

どうですか？ちゃんとredisにセッションは入ったでしょうか？

ここに書いたことは、実は大体このページを見れば分かることです。↓
[https://github.com/nicolasff/phpredis][2]

それではみなさん愉快なセッションライフを！
(記事の中に間違いとかがあったら、どんどん指摘してくださいね！)

 [1]: http://github.com/owlient/phpredis "http://github.com/owlient/phpredis"
 [2]: https://github.com/nicolasff/phpredis "https://github.com/nicolasff/phpredis"
