---
title: '#15 July Tech Festa( #TechFesta )に行きました'
author: rrreeeyyy
categories:
  - 勉強会
comments: true
pubDate: 2013/07/15
---

こんにちわ。れいです。
昨日は[July Tech Festa][1]というITエンジニア夏の祭典に行って来ました！

<!--more-->

# JTF(July Tech Festa)

> クラウド環境が普及し，関連した話題が盛り上がり，これにしたがい，
> これらを裏側で実現する開発者の技術修得の意欲が高まってきています。
> また，各種ITトレンドが凄まじい速度で移り変わり，技術者同士が活発に交流し，
> 情報交換と人脈構築をしようという動きが顕著にみられます。
> これらの意欲と活動に応じるため，ITに係るエンジニアの知的興味を満足するための夏の祭典として
> 「コードの中のインフラ（Infrastructure as Programming）」
> をスローガンに当イベントを開催いたします。

(引用: [July Tech Festa][1])

※消して手抜きではありません

---

場所は[産業技術大学院大学][2]！

![AIIT](/images/blog/aiit.jpg)

朝は[弊大学][3]の[オープンキャンパス][4]だったので、JTF自体はお昼からの参加でした。

---

到着して真っ先に配布されたお弁当を食べ、chefハンズオンに向かいました！

![chef-handson](/images/blog/chef-handson.png)

オープンソースChefはちょっとだけ触ったことがあったのですが、

Hosted Chefを触るのは初めてで、実は[Opscode][5]の事も全然知りませんでした。

なのでOpscodeをどう使い、そこからChefをどう使っていくかの流れが分かり、大変良かったです。

実際、部屋には収まりきらないほど人が居て、

ITインフラの自動化やchefが注目を浴びている事がよく分かりました。

(chefの記事もそのうち書きたいですね…)

---

![serverspec](/images/blog/serverspec.jpg)

続いては "serverspec: Chef/Puppetと一緒に使うサーバテストのためのテスティングフレームワーク"

お馴染み paperboy&co. の [mizzy][6] さんです。

実は [hbstudy#45][7] でこの話を聞けているはずだったのですが…当日電車が止まりいけず…

大変悔しい思いをしていたのですが、JTFで聞ける！ということで楽しみでした。

内容はhbstudy#45の[このスライド][8]とほぼ同じで、

serverspec開発の経緯や実際のデモ、サーバのCIについてなどの話でした。

---

![cupa](/images/blog/cupa.jpg)

さてさて続いてはクラウド運用管理研究会のお話です。

まずはMySQLの冗長構成のお話でした。

(クラウド運用管理研究会、なのでクラウドの話からスタートかと思いきやでびっくりしました…ｗ)

時代の流れと共に変化するMySQLの冗長構成について、

それぞれのメリット/デメリットや運用上のノウハウ等を交えたお話をされてました。

おおまかに分けると、

- Heartbeat + mon
- Heartbeat + DRBD
- AmazonRDS
- MHA

の話をされてたかなーと思います。

MHAに関しては最近興味が湧いてきていたので、話が聞けてすごくラッキーだったと思います。

これは必ずあとで検証してみようと思います。

余談ですがMHAでググったら2番目に[弊社ブログ記事][9]がヒットしてました。

社内勉強会のネタとかデモとかになったりしないかな…。(チラッ)

---

その後、オープンソースのクラウドマネジメントツール Scalrのお話がありました。

Scalrの存在を実は全く知らなかったのですが、いやーこれはすごい。こういうのがあるんですねぇ世の中…。

個人レベルだとあんまり使えないかもしれないですが、ちょっと触ってみたい、

と思わせてくれる魅力があるOSSでした。

---

![kaju](/images/blog/kaju.jpg)

道中でスポンサーの[Oisix][10]さんのジュースをゲットしたりしながらラストのLTへ向かいました。

---

![LT](/images/blog/lt.jpg)

Zabbixの拡張ツール [Hyclops][11] を開発された話とか、

3連続でLTされた方が居たりとか(すごい話が面白い方でした)、

地味に嬉しかったのは馬場さんの[nouka][12]の話を聞けたことですかねｗ

(実は1回も聞いたことが無かった)

講演されてた方はもちろんLTの方もすごく為になる話ばっかりで、

いつかは前に出て話して見たいなぁと思わせてくれました。

---

![beer](/images/blog/beer.jpg)

そして懇親会でビールを飲みました。

勉強会は懇親会が本番とよく聞きますが、そりゃもうすごい人がバンバン出てきて…

色んな話を聞かせて貰ってすごく楽しかったです！

あと年が近い方もいらっしゃって、お知り合いになれてよかったです。

(年が近い人と勉強会で会うことがあまり多くないので)

そんなこんなで大変楽しかったです。ほんとに行ってよかった。

---

![end](/images/blog/end.jpg)

実は終わった後、運営の方と2次会に参加させて貰っていましたｗ

こちらも皆さんすごい人で、なぜ僕があそこにいたのか皆さん疑問だったと思うんですが、

またまたとても楽しい話を聞けて、ほんとによかったです。ありがとうございました。

---



余談: このブログを書こうと思っていたらいつの間にかブログの移設作業をしてました。

何か変な所とかがあったらこっそりTwitterかなにかで教えて下さい。

ブログ移設に関するブログも書きたいですね…。

 [1]: http://www.techfesta.jp/
 [2]: http://aiit.ac.jp/
 [3]: http://www.uec.ac.jp/
 [4]: http://www.uec.ac.jp/admission/open-department/opencampus/
 [5]: http://www.opscode.com/
 [6]: http://mizzy.org/
 [7]: http://connpass.com/event/2580/
 [8]: http://www.slideshare.net/mizzy/serverspec-hbstudy45
 [9]: http://heartbeats.jp/hbblog/2013/05/mysql-mha-haproxy.html
 [10]: https://www.oisix.com/
 [11]: http://tech-sketch.github.io/hyclops/jp/
 [12]: http://www.slideshare.net/toshiak_netmark/nouka-inventry-manager
