---
title: '若手インフラエンジニア現状確認会 #wakateinfra に参加したまとめ'
author: rrreeeyyy
published: true
categories:
  - 勉強会
comments: true
pubDate: 2015/02/23
---

若手インフラエンジニア現状確認会に参加してきた。とにかく最高だった。

<!--more-->

---

# 若手インフラエンジニア現状確認会

きっかけはこれです。

<blockquote class="twitter-tweet" lang="ja"><p><a href="https://twitter.com/rrreeeyyy">@rrreeeyyy</a> <a href="https://twitter.com/deeeet">@deeeet</a> <a href="https://twitter.com/y_uuk1">@y_uuk1</a> 飲み会しよ <a href="http://t.co/zUehyYnP7v">pic.twitter.com/zUehyYnP7v</a></p>&mdash; okumura takahiro (@hfm) <a href="https://twitter.com/hfm/status/558265671209869312">2015, 1月 22</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[Mackerel Meetup #3 Tokyo](http://blog-ja.mackerel.io/entry/2015/01/08/120457) に参加した辺りで若手少ないかつ交流そんなにないよね、みたいになって開催が決定した。

あれよあれよという間に各社から有名若手がバンバン集まってきてこの中に居ていいのか...みたいな気分はあったんだけど、参加してみたらとにかく最高だった。

# 資料

各人の発表資料(無い人もいる)とちょっとしたまとめ、思ったことを付しておく。

---

<iframe src="//www.slideshare.net/slideshow/embed_code/44922062" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/hifumis/20150220-wakateinfraengineergenjohkakuninkai" title="若手インフラエンジニア現状確認会 @hfm #wakateinfra" target="_blank">若手インフラエンジニア現状確認会 @hfm #wakateinfra</a> </strong> from <strong><a href="//www.slideshare.net/hifumis" target="_blank">Takahiro Okumura</a></strong> </div></strong>

ペパボ、IRC の様子をみても Twitter の様子を見てもとても良い雰囲気で仕事が出来ているように見えてとても羨ましい。

IRC の Kernel チャンネルみたいなのはみんな「良さそう」とか「欲しい」とか言っていたので、若者は意外とカーネルに興味がある模様です(私も含め)。

これからやりたい事として「カーネルレイヤの勉強」という風に言っていた(構成管理ツールはもう飽きたとのこと)。

自動化コード化と叫ばれる中で、カーネルレイヤの勉強がやりたい！と言う若者は中々珍しいよねとか、

構成管理ツールのような上位レイヤだけでなく、もっと低レイヤの勉強も必要だよねとか、そんな事を話した気がする。

---

<script async class="speakerdeck-embed" data-id="31149b69a5274faeb04ada21eb26849d" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

個人的な感想だけど、[@deeeet](https://twitter.com/deeeet) くんは本当に彗星のように現れたと思っていて、

印象的な素晴らしい発表/ブログ記事等の発信を続けてるのはどういうモチベーションなんだろうと割と気になっていたけどそれが分かってめっちゃ良かった。

あと「筋肉運用」という単語がその場でめっちゃウケて、自動化されていなかったり属人でとにかく頑張るみたいな運用を指す単語だと思うんだけど的確で良かった。

本当に自動化/効率化に対する意欲が高くて、そういう運用に嫌悪感すら感じると言っていてすごいなと思った。

自分もある程度妥協してしまう点があるので、見習わなければならない。

---

[ゆううきブログ](http://yuuki.hatenablog.com/)

資料最初の 3 ページぐらい喋って、あとはここ数年のブログ記事読みながら話してた感じだった。

彼もまた良いブログ/発表のアウトプットが常日頃からできていて素晴らしいなあと思っている。

聞くところによるとはてなには、年間でもっともはてブがついた記事を書いた人を評価する制度があるらしい(会社のブログに書くと 2 倍の値で評価されるらしい)。

そうやって各個人がアウトプットした成果を定量的に評価する制度は結構珍しいような気がしていて、良いなと個人的に思った。

あと輪読会があって羨ましい。

システム系の論文をカジュアルに読める会みたいなのがもっと増えるといいよね、と若手で話していた(いくつかあるのは知っているのだけれど僕はまだあんまり参加出来てない)。

例えば SICP の輪読会や CTMCP の輪読会のように、タネンバウム先生の本を読むようなイベント等もあってもいいかもしれない。

[paper-we-love](https://github.com/papers-we-love/papers-we-love) という論文紹介のリポジトリが紹介されたのはこの辺だったかな。

---

[@ryot_a_rai](https://twitter.com/ryot_a_rai) 氏の発表。

Infrataster, Itamae ... と兎に角最高のツールをバンバン出してくれてる。

どういう理由で今の会社にいるとか、いつ IT 系にそもそも興味持ったとかの話聞けてめっちゃ良かった。

あとはク社のサイトの構造がどうなってるとか、中はどんな風になってるみたいな話をした。

実は [waker](https://github.com/ryotarai/waker) というのも作っていてそれもどうやら動いてるらしい。

話の中に「NoOps」という単語が出てきてとても印象的だった。全てが自動化された究極の境地っぽい、最高。

インフラのテストについても喋った気がする、僕自身はもう少し色々なテストが自動になればいいなと思っていて、以下の 2 つを挙げた気がする。

- 冗長性のテスト
- パフォーマンステスト

現場だと、この辺は未だに手動でやっていたり、半自動程度にしかなっていないことがある。

NoOps を目指すならこの辺りの部分もしっかりテストして確信を得て、かつ周りを説得できる材料として用意しないといけないのかも、と思っている。

でも NoOps とは良い言葉だ。インフラエンジニアに限らず色々な職種の人が自動化を行いここを目指す必要がある気がしている。

---

<script async class="speakerdeck-embed" data-id="853dba70b43c40b49068deb17ef57e29" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

[若手インフラエンジニア現状確認会で発表しました #wakateinfra - catatsuyとは](http://catatsuy.hateblo.jp/entry/2015/02/21/205303)

かなり現場感のある話で良かった。

特に、配信サーバ関連で使われているツールと、移行の時の事故で盛り上がった気がする。

筋肉運用にあたるんだけど、何回も発生する作業ではないし、こういう移設/移行作業をいかに自動化/効率化するかというのは結構課題かもしれない。

最初から自動化されているならいいんだけど、そうも言ってられないので、ここ数年はそういうことで悩むのだろうなと思った。

---

<iframe src="//www.slideshare.net/slideshow/embed_code/44931609" width="425" height="355" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/rrreeeyyy117/infra-younger" title="Infra younger" target="_blank">Infra younger</a> </strong> from <strong><a href="//www.slideshare.net/rrreeeyyy117" target="_blank">YOSHIKAWA Ryota</a></strong> </div>

そしてこれが私の発表。

自動化効率化が進み、インフラエンジニアの仕事はどんどん無くなると予想している。

単純にインタフェースやシステムに関わるロジックを直接書くプログラマより早く、インフラエンジニアの戸口は減少すると思っている(消滅するとは全く思っていない)。

もちろんアプリケーションのロジックや規模にもよるが、多くの人間は GAE や Heroku を使えば十分であることが多かったり、色々よしなにやってくれるクラウドサービスも多くある。

その辺のサービスが発展した時に、我々はどうすれば(あるいは何をしている)のだろうね？と言うのが問いだった。

全く答えは出てない(出てないのでここで色々議論したかったという狙いがある)のだけど、特に悲観的になっていると言う訳ではない。

スライド中にあるように、提供するサービスに応じて、どのサービスを組み合わせる、どの基盤を使うとコストが最小になり、効率的に運用できるか考える人の存在というのはもちろん必要だし、

各種クラウドやモニタリング等のサービスを提供する側の事業者というのも勿論必要だと思う。

また、[@hfm](https://twitter.com/hfm) くんが、研究開発や次世代のミドルウェアの開発で食っていく道というのもあるよね、と言っていて確かにそういえばそうだと思った。

Linux カーネルの勉強をすれば安全かといえば、まあそういうわけでもなく、Linux がなくなったら(しばらくはなくならないという話にはなったが)どうしようという話にもなった。

とにかく上っ面でなく論理的で本質的で応用の効きやすい知識(とはなんだろうね？)をしっかり学ぶ必要があるよね、という結論になったのが深夜 1 時辺りだったかもしれない。

僕は結構適当な人間なので、こういう問いかけをしておきながら、仕事がなくなるのは大歓迎(収入がなくなるのは歓迎でない)なので、自動化が進んだらまた考えようと思っている。

とはいえ考えないと仕事ばかりなくなって収入を得ることができなくなる可能性もあるので、日々うんうん悩みながら暮らすしかなさそう。結果なるようになってくれると嬉しい。

---

とにかく最高で、普段気になってる皆がどういう成り立ちで今の活動をしているのかとか、どういう事をやっているのかというのが分かって大変良かった。

インフラエンジニアといっても各社様々で、全く違うことをしていたり、かと思えば同じようなことで悩んでいた。

そういう人たちが一同に会してビールを片手に夢や悩みや考えを共有する会が最高でないわけが無かった。

今までそういう機会はあまり多くなかったので、参加出来て大変良かった。次回(京都？)も絶対行くぞ！

最後に、企画してくれた [@hfm](https://twitter.com/hfm) くんと参加した [@deeeet](https://twitter.com/deeeet) くん、[@y_uuk1](https://twitter.com/y_uuk1) くん、 [@ryot_a_rai](https://twitter.com/ryot_a_rai) くんと、ビール/会場を準備してくれた [@catatsuy](https://twitter.com/catatsuy) くんと会場を貸してくれた pixiv 社に感謝！
