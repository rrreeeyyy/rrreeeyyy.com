---
title: '#13 vimでmarkdownのlive previewをする'
author: rrreeeyyy
categories:
  - vim
comments: true
pubDate: 2013/01/09
---
こんばんわ。れいです。 タイトルの通り、
vimでmarkdownのlive previewをする方法を紹介します。
<!--more-->

### vim

*   言わずと知れたエディタ

### Markdown

*   言わずと知れた軽量マークアップ言語

### live preview

*   書いたMarkdownをリアルタイムでレンダリングする

&nbsp;

vimはここで魅力を語るまでもない素晴らしいエディタです。

Markdownは簡単に装飾された文章が書けるのですごく良いです。

書いたMarkdownをそのままビジュアルで見れるのはハッピーです。

&nbsp;

### 今まで

MarkdownのLive previewをしようと思ったら、

*   Webサイト
*   Mou
*   TextMate
*   reText

などの選択肢がありました。
これらは便利でしたが、やはり使い慣れたエディタでMarkdownをlive previewで書きたかったのです。

&nbsp;

### そこで

[instant-markdown-d][1] と [vim-instant-markdown][2] です。

&nbsp;

#### instant-markdown-d

*   node.jsで作られた、markdownをlive previewする用のサーバです

##### インストール方法

ターミナル上で

```
# gem install redcarpet pygments.rb
# npm -g install instant-markdown-d
```

※ Ruby, node.jsが入ってない人は入れてください。
brew install nodejs など。

たったこれだけで入ります。
起動してみましょう。

``` bash
# instant-markdown-d
   info  - socket.io started
```

こんなかんじで、socket.ioが起動すればインストール成功です。
サーバがlocalhostの8090でLISTENを始めます。
PUT, DELETEメソッドを使ってmarkdownのupload、サーバの終了を行います。

&nbsp;

#### vim-instant-markdown

vim-instant-markdownを入れると、vimでファイルを編集中に、
ほぼ自動的に現在のバッファをinstant-markdown-dにPUTしてくれます。
instant-markdown-dはsocket.ioで自動更新されるので、live previewを味わう事ができます。

##### インストール方法

個人のvimの環境によって様々なので、適宜読み替えてください。
例はこんな感じです。

``` bash
# git clone git://github.com/chreekat/vim-instant-markdown.git
# mkdir -p ~/.vim/after/ftplugin/markdown/
# mv {vim-instant-markdown,~/.vim}/after/ftplugin/markdown/instant-markdown.vim
```

&nbsp;

さあ、これでMarkdownなファイルを開いてみましょう。
正しくインストールできていればデフォルトのブラウザでlocalhost:8090が起動するでしょう。
もし起動しなかった場合は、ファイルを開いた時にfiletypeがMarkdownでない。などの原因が考えられます。
vim-markdownプラグインを入れるか、 vimrcに以下の様にかくといいと思います。

``` vim
autocmd BufRead,BufNewFile *.mkd  setfiletype markdown
autocmd BufRead,BufNewFile *.md  setfiletype markdown
```

後は好きなだけMarkdownを書くだけです。
ちなみにgithub-flavored-markdownに対応してます。

<a href="/images/blog/189c9aab7f8d3f926ad9da018f0e471a.png" rel="attachment wp-att-431"><img class="alignnone size-full wp-image-431" alt="live preview" src="/images/blog/189c9aab7f8d3f926ad9da018f0e471a.png" width="1057" height="476" /></a>

&nbsp;

### 余談

今回はvimの話をしましたが、instant-markdown-d があれば、
今流行の [Sublime Text 2][3] でも
markdownのlive previewが出来そうですね〜。
Thread使ってcurlでPUTすれば…？みたいな事も考えられますね。

それでは。

 [1]: https://github.com/suan/instant-markdown-d
 [2]: https://github.com/chreekat/vim-instant-markdown
 [3]: http://www.sublimetext.com/dev
