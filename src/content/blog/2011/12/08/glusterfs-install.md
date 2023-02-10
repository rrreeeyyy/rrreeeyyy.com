---
title: '#4 GlusterFSのinstall'
author: rrreeeyyy
categories:
  - インフラ
pubDate: 2011/12/08
---
こんばんわ、れいです。
今日は社内勉強会に参加してきました〜。
MySQLの話とか、CTOのscreen捌きとか、readコマンドについてとか、サーバ移設についてとか色々あったのですが、
(僕は昨日構築したscreenについて本当に初歩的な部分だけLTしました;)
その中で最も興味を惹かれた &#8220;GlusterFS&#8221; についてちょっとだけ書きたいと思います。

<!--more-->

# ナニサ？

<p id="firstHeading">
  GlusterFSってなにさ？って話から。
</p>

<p id="firstHeading">
  GlusterFSについて知ったのは実は今日が初めてだったのですが、要は分散ファイルシステムですね。
</p>

こんなことが出来るらしいです。

*   ファイルベースのミラーリングとレプリケーション
*   ファイルベースのストライピング
*   ファイルベースの負荷分散
*   ボリュームのフェイルオーバー
*   スケジューリングとディスクキャッシュ
*   ディスククオータ

<div>
  (Wikipediaからの引用です:)
</div>

<div>
  詳しくは、検索して調べてみてください。
</div>

<div>
  日本語で解説している所もちょっとありますよ〜。
</div>

<div>
  さて、本日僕がやろうとしてるのは、そのGlusterFSのinstallです。
</div>

<div>
  もし上手くいったら、そのうち実際の設定とかも書いて行きたいですね。
</div>

<div>
  GlusterFSのインストールですが、
</div>

## yumではいります。

epelかなにかのレポジトリを追加すれば

```
yum install glusterfs-server glusterfs-fuse
```

これで入るんじゃないかな、たぶん。(試してません。)

#

&#8211; おわり &#8211;

&nbsp;

&nbsp;

&nbsp;

えっと嘘です。

&nbsp;

# やってみよう！

ところで、yumで入るのはちょっと古いです。

最新バージョンの方がいいですよね？

&nbsp;

さて、

お手軽なのはrpmです。

2011年12/8現在の最新バージョンの3.2.5ですが、rpmがあります。

今回はそいつを使う事にしましょう。

```
# cat /etc/redhat-release
CentOS Linux release 6.0 (Final)
```

CentOS6系です。

```
# wget http://download.gluster.com/pub/gluster/glusterfs/3.2/LATEST/CentOS/6/glusterfs-core-3.2.5-2.el6.x86_64.rpm
# wget http://download.gluster.com/pub/gluster/glusterfs/3.2/LATEST/CentOS/6/glusterfs-fuse-3.2.5-2.el6.x86_64.rpm
# wget http://download.gluster.com/pub/gluster/glusterfs/3.2/LATEST/CentOS/6/glusterfs-geo-replication-3.2.5-2.el6.x86_64.rpm
```

そんな感じでrpmをダウンロードします。

```
# rpm -ivh glusterfs-*
```

インストールします。

終わりです。

ワオ、お手軽！！！！

(こんなに上手く行かない事もありそうですが&#8230;)

```
# /etc/init.d/glusterd start
Starting glusterd:                                         [  OK  ]
```

```
# ps aufx|grep [g]luster
root     14995  0.0  0.1  45056  7880 ?        Ssl  02:29   0:00 /opt/glusterfs/3.2.5/sbin/glusterd
```

```
# /usr/sbin/gluster -V
glusterfs 3.2.5 built on Nov 15 2011 08:43:14
Repository revision: git://git.gluster.com/glusterfs.git
Copyright (c) 2006-2011 Gluster Inc. &lt;http://www.gluster.com&gt;
GlusterFS comes with ABSOLUTELY NO WARRANTY.
You may redistribute copies of GlusterFS under the terms of the GNU General Public License.
```

無事、起動した感じですね。

さて、ちょっと内容が薄いですが、今晩中に動作確認とか使用感を書ききる自信があまりないので
(設定ファイルとかよくわかってないので&#8230;)
それは次回以降の記事にしたいと思います。
仮想サーバでのインストールも先ほど終えたので、これからちょっと色々弄くってみたいとおもいます！

glusterfsについてとか他にも面白いネタがあれば是非教えてください:)
