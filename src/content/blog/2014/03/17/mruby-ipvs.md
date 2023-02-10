---
title: '#18 mruby-ipvs を実装し卒業論文を書きました'
author: rrreeeyyy
published: true
categories:
  - infrastructure
  - ipvs
  - mruby
  - linux
  - loadbalancer
comments: true
pubDate: 2014/03/17
---

Linux の L4 ロードバランサ機能である IPVS を、

mruby から利用できるようにする mruby-ipvs という mrbgem を実装し、

その mruby-ipvs に関して卒業論文を書きました。

<!--more-->

---

# 動機

[電気通信大学][1] という大学の 4 年生に無事進級できた為、

卒業論文を書く必要がありました。

大学に通いながら、[株式会社ハートビーツ][2] で学生スタッフとして働いていた経験上、

Linux カーネル内に実装されている L4 ロードバランサ機能である [IP Virtual Server][3] (IPVS) の、

インタフェースに不便しており、なんとかしたいという気持ちがありました。

個人的に Ruby が好きであることに加え、[Chef][4] に代表されるような、

インフラストラクチャ自動化フレームワークが Ruby で書かれ始めていること、

更に、[mod\_mruby][5] といった [mruby][6] を用いたインタフェースの登場もあり、

卒業論文のテーマとして、IPVS のインタフェースを mruby で実装することを選択しました。[^1]

---

# mruby-ipvs について

mruby-ipvs は、先述の通り Linux の L4 ロードバランサ機能である IPVS を、

mruby から操作できるようにした mrbgem です。

今のところ、mgem コマンドからインストールすることが出来ないため、[^2]

build\_config.rb や gembox を直接編集し、任意の場所に下記を追記するなどしてください。

```
  conf.gem :git => 'https://github.com/rrreeeyyy/mruby-ipvs'
```

リポジトリの example にありますが、下記のように記述することが出来ます。

```ruby
s = IPVS::Service.new({
  'addr' => '10.0.0.1:80',
  'port' => 80,
  'sched_name' => 'wrr'
}).add_service
d1 = IPVS::Dest.new({
  'addr' => '192.168.0.1',
  'port' => 80,
  'weight' => 1
})
d2 = IPVS::Dest.new({
  'addr' => '192.168.0.2',
  'port' => 80,
  'weight' => 1
})
s.add_dest(d1)
s.add_dest(d2)

d1.weight = 3
```

Service と Destination をそれぞれインスタンスとして生成します。

Service は add\_service や del\_service することで、

IPVS に登録したり削除したりすることが出来ます。

Destination は Service インスタンスの add\_dest メソッドの引数に渡すことで、

その Service の Destination として IPVS に登録されます。

インスタンスを作る際の引数の与え方で、振り分けメソッドや重みなどを変更できます。[^3]

[こんな感じ][10] に書くことで、Keepalived のような構文で書くことも出来たりします。

将来的には、他の mrbgem を用いてヘルスチェックを行いながら、

動的に振り分け先を追加したり、重みを変更したり、何らかのスクリプトを実行したり…など、

IPVS にまつわる操作を自動化する一助になればいいなと思っています。[^4]

---

# リポジトリ

[mruby-ipvs][7]

正直、コードの質が良くなかったり、未実装な部分がかなりあるのですが、

使えることには使えるので公開します。

今月で無事に大学を卒業出来るようですが、実装は続けようと思っているので、

pull-request やバグ報告などあれば頂けると幸いです。

今後にご期待ください。

近日中に mgem からインストールできるように pull-request を出したいと思っています。[^5]

---

# 論文

[論文][8]

[発表スライド][9]

論文に関しては、構成がめちゃくちゃだったり、

誤りがあるような気がする箇所がそれなりにあるのですが、

読めることには読めるので公開します。(あんまり見ないで下さい)

---

# 謝辞

所属していた [岩崎・中野・鵜川研究室][15] の皆様には大変お世話になりました。

(特に、指導教員の皆様や、助言を頂いた諸先輩方、更に僕の論文の誤りを最も多く検出してくれた [@nari\_ex][20] さん)

また、[株式会社ハートビーツ][2] の皆様にも大変お世話になりました。

(特に、誕生日プレゼントと称して研究室に物資を送り届けてくれた [@ka\_maekawa][16] さん)

更に、[mod\_mruby][5] の作者である [@matsumotory][17] さんに、

直接の面識やお話したことはないものの、研究の動機を与えてくださったことに感謝申し上げます。

また、mruby に関する様々な情報を Web 上に公開してくださってるみなさん、大変参考になりました。

ありがとうございました。

---

2014/3/18 0:16 追記

無事、mgem-list に pull-request を出し、[mergeされました][18]

ので、今後は mgem コマンドから build\_config.rb の追記分を生成することが出来ます。

mgem の使い方に関しては、[今日からmrubyをはじめる人へ][19] が大変参考になるので、

そちらをご覧ください。"mruby-ipvs" という名前で登録してあります。

---

※このブログの内容は個人の見解であり、所属する組織の公式見解でも組織を代表するものでもありません※

 [1]: http://www.uec.ac.jp/
 [2]: http://heartbeats.jp/
 [3]: http://www.linuxvirtualserver.org/software/ipvs.html
 [4]: http://www.getchef.com/chef/
 [5]: https://github.com/matsumoto-r/mod_mruby
 [6]: http://forum.mruby.org/
 [7]: https://github.com/rrreeeyyy/mruby-ipvs
 [8]: http://rrreeeyyy.com/thesis/thesis.pdf
 [9]: http://rrreeeyyy.com/thesis/GraduationSlide.pdf
 [10]: https://github.com/rrreeeyyy/mruby-ipvs/blob/master/example/keepalived.rb
 [15]: http://ipl-www.cs.uec.ac.jp/dokuwiki/public/start
 [16]: https://twitter.com/ka_maekawa/
 [17]: https://twitter.com/matsumotory
 [18]: https://github.com/mruby/mgem-list/pull/72
 [19]: http://blog.matsumoto-r.jp/?p=3310
 [20]: https://twitter.com/nari_ex

 [^1]: 更に、C 言語で書かれた libipvs を使用するのに、mruby で実装することが都合がよかったのです
 [^2]: すみません！ ※2014/3/18 に追加されました
 [^3]: 未実装のパラメータがいくつもあります
 [^4]: そのためには未実装の箇所が多すぎます
 [^5]: 大阪行きの新幹線の中で書いているので、大阪から帰ってきたらにします。
