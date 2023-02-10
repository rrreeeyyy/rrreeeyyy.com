---
title: '#6 20歳までにやりたいこと'
author: rrreeeyyy
categories:
  - インフラ
pubDate: 2011/12/15
---
こんばんわ、れいです。
今日は20歳までにやってみたい事について書こうと思います。
(あと1ヶ月+αで20歳なので)

<!--more-->

構成
物理サーバ3台 + 仮想サーバ

rrreeeyyy.com(P) &#8211; coco-01(V)
nari64.com(P) &#8211; webdb02(V)
bonjour-01(P) &#8211; &#8230;9 hosts(V)

やりたい:
いわゆる HAクラスタ と言うやつを組みたい

やらなきゃいけない:
今現在2台の物理サーバで動いているサービスをそのまま、再構築してHAクラスタ化。

→ NagiosとかMuninとかblogとかmailを一晩程度止める事はご勘弁願いたい&#8230;
(誰も使ってないし)

そもそも出来るかどうか分かりませんが、
想定手順をちょっと書いてみました。

想定手順:

## (0) &#8211; 準備編 -

(0-1) rrreeeyyy.com上で動作しているnagios,munin,blog,mail,svn等のほぼ同様の環境をcoco-01上に構築する

(0-2)[必要なら] nari64.com上で動作しているblog,mail等のほぼ同様の環境をwebdb02上に構築する

## (1) &#8211; nari64.com再構築編 -

(1-1)[必要なら] nari64.com上のwebdb02のimg,xmlファイルをrrreeeyyy.com上に退避(scp or rsync等&#8230;)させ、nari64.comを再インストール

(1-2) nari64.comにNICを実装

(1-3)[必要なら] nari64.com上でKVMを再構築し、img,xmlファイルを差し戻し、起動を確認する。

(1-4) nari64.com上でルータ化できるような構成にしておく(dhcpd,pppoe等)

## (2) &#8211; rrreeeyyy.com再構築編 -

(2-1) rrreeeyyy.com上のiptables,pppoe接続等の設定ファイルを確認し、使用出来そうなファイルはnari64.com上に転送しておく。

(2-2) rrreeeyyy.com上のcoco-01のimg,xmlファイルをnari64.com上に退避させる。

(2-3) rrreeeyyy.comをシャットダウンし、nari64.comにてpppoe接続、iptables,dhcp等のルータ化設定を実施

(2-4) rrreeeyyy.comのOSを再インストールし、KVMを再構築する。[必要があればcoco-01のimg,xmlを差し戻して動作確認]

&#8211;(ここからHAクラスタの構築)&#8211;

## (3) &#8211; keepalivedの構築編 -

(3-1) nari64.com上でkeepalivedの構築を実施

(3-2) nari64.com上でkeepalivedの振り分け設定を実施

(3-3) rrreeeyyy.com上でkeepalivedの構築を実施

(3-4) rrreeeyyy.com上で (3-2) の設定ファイルを持ってくる

(3-5) master-slaveの設定を実施

(3-6) failover-failbackの確認

## (4) &#8211; glusterFSの構築編

(4-1) rrreeeyyy.com上でglusterFSの構築

(4-2) nari64.com上でglusterFSの構築

(4-3) 上記2サーバでdistributeの構成を取る

(4-4) bonjour-01上でglusterFSの構築

(4-5) rrreeeyyy.com,nari64.comの両サーバのファイルをbonjour-01上にreplica構成(geo-replica?)を取る

&#8211;出来るか分からない所&#8211;

(4-6) rrreeeyyy.com(or nari64.com)上にHDDを実装

(4-7) bonjour-01,rrreeeyyy.com,nari64の3サーバでdistributeの構成を取る

(4-8) rrreeeyyy.com,nari64,bonjour-01のそれぞれのhostで実装したHDDにreplicaを取る

&#8211;出来るか分からない所&#8211;

(4-9) 色々確認

(終了)

/* 最後の方ちょっと面倒になって適当…
* もしかしたら仮想サーバ周りも色々いじるのかも…
* そもそも出来るか分からない
* 3,4の工程の鬼畜度がすごい
*/

(買うもの)
・[必要なら]HDD1〜2台 洪水…
・スイッチングハブ(Gigabitで) 3000円くらいらしい
・LANケーブル数本(Gigabitで) たぶんやすい
・NIC1枚 3000円ぐらいだと思う

他にははもっといろんな人と仲良くなりたいです！
みなさんよろしくお願いします！！

なんかこうした方がもっとよろしげな構成だよとかあったら教えてください…

あと仲良くなってくださる方もよろしくお願いします…。
