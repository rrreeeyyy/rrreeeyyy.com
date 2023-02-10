---
title: '#18 vagrantやdockerやchefやansibleについて'
author: rrreeeyyy
published: false
categories:
  - infrastructure
  - vagrant
  - docker
  - chef
  - ansible
comments: true
pubDate: 2014/03/03
---

DevOpsやInfrastructure as codeやImmutable Infrastructureなどの言葉と、
それを取り巻くソフトウェアたちが話題になってきています。

僕は落ちこぼれて置いて行かれてしまったので、

- vagrant
- docker
- chef
- ansible

について、簡単な用途とどんなところで使うのが良さそうかなという主観をまとめておきます。

<!--more-->

# はじめに

電気通信大学に通っている学生の皆さんなら [全学無線LAN][2] 使ってますよね？

今日は [全学無線LAN][2] を今までよりちょっと便利に使う方法を紹介します。

---

# 何が不便なのか

電気通信大学に通っている学生の皆さんなら、

一度は [全学無線LAN][2] に不便を感じた事がありますよね？[^1]

<blockquote class="twitter-tweet" lang="ja"><p>uecwutnはゴミ</p>&mdash; こはく (@alstamber) <a href="https://twitter.com/alstamber/statuses/400537218663460864">2013, 11月 13</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

そもそも、 [全学無線LAN][2] で割り当てられるIP帯では

基本的に学外のネットワークと通信する事は出来ません。

そこで、 proxy サーバを用いて学外のネットワークと通信を行います。

ここで幾つかの制限が生まれるので、不便になる訳です。

恐らく、普通に設定をするとWebブラウジングするのが限界です。[^2]

# ssh をする

電気通信大学に通っている学生の皆さんなら、

学外のサーバに ssh 接続をして作業がしたくて堪らないですよね？

先述の通り、 [全学無線LAN][2] では学外のネットワークに直接接続することは出来ません。

そこで、一度学外に到達できる学内サーバに ssh をして、

そこから更に学外のサーバに ssh をする必要があります。

この辺りは賢い電気通信大学の皆さんなら経験があると思います。

通常ならこうしますね。

(学内サーバを uec , 学外サーバを server1 とします。) [^3]

```bash
localhost: ~ myname$ ssh uec -lusername
[username@uec ~]$ ssh server1 -lmyname
[myname@server1 ~]$
```

もう少し慣れた人はこうするでしょうか [^4]

```bash
localhost: ~ myname$ ssh uec -lusername -t ssh server1 -lmyname
[myname@server1 ~]$
```

良いでしょう。でもこういうものがあります。

[プロクシサーバにおけるSSHプロトコルサポート開始のお知らせ][3]

proxy サーバが 2011/6/6 より ssh プロトコルをサポートしています。

proxy サーバを proxy-server ,ポートを 8080 とすると、こういうふうに出来ますよね。[^5]

```bash
localhost: ~ myname$ ssh -o 'ProxyCommand nc -X connect -x proxy-server:8080 %h %p' server1
[myname@server1 ~]$
```

なんだか良さそうですね、ただちょっと長いですね。
.bashrc に alias 定義しますか？

```bash
localhost: ~ myname$ cat ~/.bashrc | grep ssh-uec
alias ssh-uec="ssh -o 'ProxyCommand nc -X connect -x proxy-east.uec.ac.jp:8080 %h %p' -o 'ServerAliveInterval=60'"
```

うーん、微妙ですね。こっちのほうがいいでしょうか？

```bash
localhost: ~ myname$ cat ~/.ssh/config
Host server1
    ProxyCommand nc -X connect -x proxy-server:8080 %h %p
```

これだと server1 に行きたいときいつも proxy を経由しちゃいますね…。

ssh の -F オプションを使ってファイルを別管理にするか、こんな風にするしかないかな？

```bash
localhost: ~ myname$ cat ~/.ssh/config
Host *%proxy
    ProxyCommand nc -X connect -x proxy-server:8080 %h %p

Host server1
    User myname

localhost: ~ myname$ ssh server1%proxy # 学内から自宅サーバに接続
localhost: ~ myname$ ssh server1 # 学外から自宅サーバに接続
```

シェルスクリプトで使うコンフィグを書き換えるとか色々あると思いますが、

もっと良いソリューションがある人は教えて下さい。

ssh を手に入れてしまえばこっちのものです。

# http , https で接続する

電気通信大学に通っている学生の皆さんなら、

当然ターミナル上から gem install したり brew install したいですよね？

しかし、Mac のターミナルは システムの proxy を引き継ぎません。 [^6]

http_proxy, https_proxy, ALL_PROXY などの環境変数を使います。

```bash
$ export http_proxy=http://proxy-server:8080/
$ export https_proxy=http://proxy-server:8080/
$ export ALL_PROXY=http://proxy-server:8080/
```

お家に帰ったらこうですね。

```bash
$ unset http_proxy
$ unset https_proxy
$ unset ALL_PROXY
```

さて、 電気通信大学に通っている学生の皆さんなら、

当然 github を学内で使いたくなりますよね？

git は http_proxy を見てくれないです。なのでこうです。

```bash
$ git config --global http.proxy proxy-server
$ git config --global https.proxy proxy-server
$ git config --global url."https://".insteadOf git://
```

お家に帰ったらこうですね。

```bash
$ git config --global --unset http.proxy
$ git config --global --unset https.proxy
$ git config --global --unset url."https://".insteadOf
```

徐々に快適になってきましたね。

しかし毎回やるのは面倒ですよね。

優秀な皆さんなら自動化したくなるはずです。

Mac には airport と言うコマンドがあり、それでネットワークの状況を取得できます。

```bash
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I
```

これを使って、SSID 毎に設定を切り替えるスクリプトを書いてみましょう。

```bash
#!/bin/bash
AIRPORT="/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport"
if test "` ${AIRPORT} -I |grep [^B]SSID|awk '{print $2}'`" = "uecwutn"; then
  export http_proxy=http://proxy-east.uec.ac.jp:8080/
  export https_proxy=https://proxy-east.uec.ac.jp:8080/
  export ALL_PROXY=http://proxy-east.uec.ac.jp:8080/
  git config --global http.proxy proxy-server
  git config --global https.proxy proxy-server
  git config --global url."https://".insteadOf git://
else
  unset http_proxy
  unset https_proxy
  unset ALL_PROXY
  git config --global --unset http.proxy
  git config --global --unset https.proxy
  git config --global --unset url."https://".insteadOf
fi
```

いちいち叩くの面倒そうなので、 .bashrc 辺りに書き込んであげるといいと思います。

さらにさらに、無線につなぐたびに認証を求められるのは面倒なので、そこも自動化しましょう。

curl コマンドで form に ID と Password を POST することで認証を抜けることが出来ます。

```bash
$ curl -d "fname=wba_login&username=${STUDENT_ID}&key=${STUDENT_PW}" https://xxx.xxx.xxx.jp/aaa/login.htm
```

また、Mac ユーザの中には ネットワーク環境 で Proxy を使うかどうか切り替えてる方もいるかもしれません。

こんなコマンドがあります。

```bash
$ /usr/sbin/scselect ${NETENV_NAME}
```

これで、ネットワーク環境で定義された環境に変更することが出来ます。

但し、日本語の環境名は使えないので注意してください。

# メールを受信する

電気通信大学に通っている学生の皆さんなら、

学内でももちろんメールチェックに暇がないですよね？

ところが、学内では先述の通りメールは受信できません…。

一部の賢い電気通信大学の学生の皆さんなら、

自宅にメールサーバがあると思うので、 Roundcube 等を構築すればいいと思います。[^8]

しかし、どうしても学内で Thunderbird 等のメールクライアントからメールを受信したい人も居ますよね？

ssh を手に入れてしまった私達に不可能はありません。

ssh ポートフォワーディングをしましょう。

```bash
localhost$ ssh myserver -L 10110:localhost:110
```

これで、 myserver の 110 番ポートと localhost の 10110 番ポートがつながります。

telnet で確認してみてください。[^7]

```bash
$ telnet localhost 10110
Trying ::1...
Connected to localhost.
Escape character is '^]'.
+OK
```

gmail が受信したいんじゃ！！ という方はこうです。[^9]

```bash
localhost$ ssh myserver -L 10995:pop.gmail.com:995
```

あとは Thunderbird で localhost 10995 などに対応するメールアカウントを作ってあげてください。[^10]

IMAP, SMTP 等も同様の方法で出来るので割愛します。

# LINE する

電気通信大学に通っている学生の皆さんなら、

超絶リア充で LINE の確認に暇がないですよね？

しかし学内では当然 LINE は出来ません。

そこで VPN を使います。[^11]

お馴染みポートフォワードです。

```bash
localhost$ ssh myserver -L 11194:vpn-server:1194
```

そして VPN につないで、適当にルーティングをいじってあげれば LINE 出来ます。[^12]

LINE のログイン認証をするサーバは gd2.line.naver.jp なので、次のようにルーティングを変更します。

```bash
# route -nv add -host gd2.line.never.jp ${GATEWAY_IP}
```

また、メールの受信なども、VPN があればルーティングでなんとかなります。

```bash
# route -nv add -host imap.googlemail.com ${GATEWAY_IP}
# route -nv add -host smtp.googlemail.com ${GATEWAY_IP}
```

# 終わりに

ネットワークの知識と ssh の接続が確立できればなんでも出来ますね。

決して最後はめんどくさくなって手を抜いた訳ではありません。すみません。

明日は僕と研究室が一緒の [こはくくん][4] の記事です。楽しみです。

 [1]: http://www.adventar.org/calendars/113
 [2]: http://www.cc.uec.ac.jp/services/all/wlan.html
 [3]: http://www.cc.uec.ac.jp/info/news/2011/06/20110606-proxyssh.html
 [4]: http://flavors.me/alstamber
 [5]: http://www.nari64.com/?p=441

 [^1]: こはく君の記事は明日です。乞うご期待。
 [^2]: 具体的にどのサービスが使えないとかは時間なかったのでちゃんと検証してないです。
 [^3]: 面倒なのでパスフレーズ無し公開鍵認証です。
 [^4]: ssh の -t オプションは pseudo-tty を強制的に割り当てます。
 [^5]: nc 周りは頑張って調べてください。
 [^6]: 当然ですが…。
 [^7]: myserver の 25番ポートが正しく動いていることが前提。
 [^8]: もしくは mutt など。変態色高まる気がしますが。
 [^9]: 一部の経路は暗号化されないので注意してくださいね。
 [^10]: POPS, SMTPS, IMAPS は telnet では当然確認できないです。 openssl コマンド使ってくださいね。
 [^11]: 電気通信大学に通っている学生の皆さんならVPNサーバ持ってますよね？
 [^12]: スタンプは別のサーバから飛んでくるので別にルーティングする必要があった気がします。
