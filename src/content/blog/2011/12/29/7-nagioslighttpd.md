---
title: '#7 nagios+lighttpd'
author: rrreeeyyy
categories:
  - PHP
  - インフラ
pubDate: 2011/12/29
---
今日はさくっと設定の紹介をして終わりです。

nagiosをlighttpdで動かすときの設定例です。

<!--more-->

アレコレ説明するのは面倒なので、はりつけちゃいます

```
$HTTP["url"] =~ "^/nagios" {
        server.document-root = "/usr/local/nagios-3.2.3/share/"
        server.indexfiles    = ( "index.php" )
        var.servername = "coco-01"
        accesslog.filename = "/var/log/lighttpd/" + var.servername + "_nagios_access.log"
        server.errorlog = "/var/log/lighttpd/" + var.servername + "_nagios_error.log"

        cgi.assign = ( ".cgi" => "" ,
        )
        fastcgi.server = (
                ".php" => (
                        "localhost" => (
                                 "host" => "127.0.0.1",
                                "port" => "9000"
                                )))

        alias.url = (
        "/nagios/cgi-bin" => "/usr/local/nagios-3.2.3/sbin/",
        "/nagios" => "/usr/local/nagios-3.2.3/share/"
        )

        auth.backend = "htpasswd"
        auth.backend.htpasswd.userfile = "/usr/local/lighttpd-1.4.29/.nagiospw"
        auth.require = ( "/" =>
        (
        "method" => "basic",
        "realm" => "Nagios Secret Zone",
        "require" => "valid-user"
        )
 )
}


```

大体こんな感じです。
nagiosは3.2.3をソースから入れてます
prefixを/usr/local/nagios-3.2.3でconfigureしてます。

lighttpdはprefixを/usr/local/lighttpd-1.4.29でconfigureしてます

phpはphp-fpmを使って、localhostの9000番ポートがlistenしてる状態です。

標準のlighttpdのconfigの書式を知っている人なら、そんなに難しくないでしょう。

ポイントは2点ぐらいです。

```
alias.url = (
   "/nagios/cgi-bin" => "/usr/local/nagios-3.2.3/sbin/",
   "/nagios" => "/usr/local/nagios-3.2.3/share/"
 )

```

ここと、

```
cgi.assign = ( ".cgi" => "" ,
 )

```

ここだけです。
nagiosは、サイト自体を表示する部分が
/usr/local/nagios-3.2.3/share/
に置いてあって、
cgiを司る部分が、
/usr/local/nagios-3.2.3/sbin/
に置いてあります、ので、
/nagios/cgi-binのディレクトリにアクセスされた場合にはcgiの方を読みに行き、
/nagiosのサイト表示部分にアクセスされたら普通のindex.php等が置いてあるフォルダを読みに行くように設定しているだけです。

次いでcgi.assignの設定ですが、少々お行儀が悪い設定です。
が、しかし、nagiosのcgiを見て頂ければ分かる通り、
(/usr/local/nagios-3.2.3/sbin/の中身を見てみてね)
nagiosのcgiは何とバイナリファイルです。
ソースを見てみると、C言語です。
(ソースのフォルダの中のnagios-3.2.3/cgi配下にあります)

と言う事で、関連づけせずにそのままlighttpdのcgiモジュールに投げてます。

…これで実行出来るから驚きなのですが…。

他にも、mailmanとかのコンパイル済みのバイナリファイル等のcgiをlighttpd上で実行したい場合は、
上のような設定にすると動作します。
(友人はUPSのWeb設定画面をこの方法で動かしていたような気がします。。。)

実は脱apacheでnagiosを動かしたい！と思い立ってから、
nginxで動かそうと試行錯誤して1週間程度やっていましたが、結局あきらめてlighttpdに乗り換えたら、こんな簡単な設定で出来たので正直拍子抜けしました。
(nginxで動かそうとしたときは、nagiosのcgiのソースコードをfcgi化してfcgiwrapperで動かそうとして結局失敗&#8230;)

なので、apacheじゃないwebサーバを検討している方々で、apacheみたいにcgiを動かしたい！って方は、lighttpdがオススメなんじゃないでしょうか。
nginxは確かに軽量で高速なwebサーバなのですが、cgiの実行に関しては全く外部委託せざるを得ないので…
(fcgiwrapperやphp-fpm,spawn-fcgiなど)

速度に関して言えば、nginxとlighttpdでほぼ大差はないように感じます(実際に厳密なベンチを取ったわけではないですが&#8230;)

これからはもしかしたら、nginx+lighttpdなんていう構成が流行るかもしれませんね？

設定ファイルもそこそこ簡単なので、lighttpdは割とオススメです！

そんな感じで、次回はもっとちゃんとした事を書こうと思います。
(恐らく時期的に自サーバの再構築が終わってるので、その構成とかについて書きたいなあなんて考えてます…)

それでは。
