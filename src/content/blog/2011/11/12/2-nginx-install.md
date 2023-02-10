---
title: '#2 nginxのインストール記'
author: rrreeeyyy
categories:
  - インフラ
tags:
  - nging
  - サーバ
pubDate: 2011/11/12
---
どうもこんにちわ。れいです。

今回は、やっぱり技術的な事を一応書いてから公開したいなと思ったので、
とりあえず出来そうなnginxのインストール記を書きます

<!--more-->

(本当はredisのビルド、起動スクリプト作成、
php-redis関数のインストールとそのテスト、ぐらいを書きたかったのですが次回へ)

> nginxとは
> HTTP とリバースプロキシのサーバで、
> メールプロキシサーバでもあります。

と書いてあります。要はapacheのようなWebサーバですね
(こんな適当な説明してると怒られちゃいますけど)。
メールプロキシサーバでもあるらしいですが。

プロキシサーバ、リバースプロキシサーバについての説明とかはしないので、
気になったらググってください。

と言っていますが、作業メモなどはないし、
なんなら今(3:06)現在にソースコードを落としてきただけなので、
作業メモと同時にこの記事を書き進める事になります。

ちなみにnginx、
「エンジンエックス」と読むぽいので覚えておくと得をするかもしれませんね。

用意したもの：100%オレンジジュース、パソコン、あきらめない心、眠くない体

まず、ソースコードのダウンロードからです。

nginxのページ
<a title="nginxのページ" href="http://nginx.org/en/download.html" target="_blank">http://nginx.org/en/download.html</a>
からソースコードをダウンロードしてきます。

\# wget http://nginx.org/download/nginx-1.1.7.tar.gz

解凍します。

\# tar zxfv nginx-1.1.7.tar.gz

中へ入ってconfigureオプションを見てみる

\# cd nginx-1.1.7

\# ./configure &#8211;help

色々オプションがありますが、諸々は後でリビルドしようと決め込んで、おもむろにconfigure

\# ./configure

.
.
.

./configure: error: the HTTP rewrite module requires the PCRE library.
You can either disable the module by using &#8211;without-http\_rewrite\_module
option, or install the PCRE library into the system, or build the PCRE library
statically from the source with nginx by using &#8211;with-pcre= option.

先方ぶちぎれ、曰く

「rewrite moduleを使うためのPCREライブラリねーけど！！
PCREライブラリ入れるかrewrite module使わねーかどっちかにしろ！！」

さて、rewrite moduleがないとお話にならないのでPCREライブラリを用意します。
(PCREライブラリはperlの正規表現のライブラリだと記憶しています)

楽をしたいのでyumでパッケージがないか探す

\# yum search pcre

pcre-devel.x86_64 : Development files for pcre
pcre.x86_64 : Perl-compatible regular expression library

多分これとかこれとか入れるといいと思います。
僕の場合はpcre-develがなかったので怒られていたようです。
(そういえばperlの正規表現のライブラリだという記憶は正しかったようです…)

と言うわけでインストール

\# yum install pcre-devel

そしておもむろにconigure

\# ./configure

めでたく成功

makeしましょう

おもむろにmake

\# make

なんだか通ったような気がするのでmake install

\# make install

無事/usr/local/nginx配下に色々置かれたようです。楽しかったですね。

さて起動しましょう。

\# /usr/local/nginx/sbin/nginx

nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)

との事。
当然ですね、今ブログを書いてるこいつはいったい何番ポートを使ってるんだという話ですよ。

取り急ぎ起動したいので/usr/local/nginx/conf/nginx.confをいじることに

serverの設定のlistenポートを8080にして起動すると起動できました。

rrreeeyyy.com:8080にアクセスすると
「Welcome to nginx!」と迎えられました、優しい子です。

と言う事で取り急ぎnginxを入れてみたわけです(3:38)
(ブログのネタにするためだけに)
次回以降はこいつをちゃんと使って行きたいですね、
それについても色々書ければいいなと思っています。

完成したもの：100%オレンジジュースの空き容器、nginx、眠い体

と言うわけでここまで読んでくださった方はありがとうございます。

何かビルドしてみて欲しいソフトウェアとか、
書いてみてほしいプログラムとかあったら
コメント欄で募集して、出来る限りの事をやってブログにあげようと思うので、
何かあれば。

あ、あとここ間違ってるよとかこうした方がいいよとかあれば、
僕とみなさんの為に是非書いてもらえるとありがたいです。

それではおやすみなさい。
