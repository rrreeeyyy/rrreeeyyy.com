---
title: '#14 tmuxinatorで開発・運用を便利に'
author: rrreeeyyy
categories:
  - tmux
comments: true
pubDate: 2013/02/25
---
こんにちわ。れいです。
今日はtmuxinatorというtmuxのセッション管理ツールを紹介します。

<!--more-->

# <span style="text-decoration: underline;">tmuxとは？</span>

[tmux][1]は、CUI上でウィンドウを管理するために用いられるソフトウェアです。

いわゆるターミナルマルチプレクサというやつですね。

tmux以外で有名なターミナルマルチプレクサに [screen ][2]があります。

詳しく知りたい方は、ぜひ調べて貰えればと思います。

こちらがとっても参考になると思います。

→ [ターミナルマルチプレクサ Advent Calendar 2011][3]

# <span style="text-decoration: underline;">tmuxinatorとは？</span>

今日の本題です。

[tmuxinator ][4]は、tmuxで起動するウィンドウやレイアウトを事前に設定しておき、

tmuxinatorコマンドを実行することにより設定通りのウィンドウ配置にするツールです。

インストールや設定方法はこちらのブログが参考になるかと思います。

[→tmuxinatorで一瞬で開発環境を起動する][5]

僕が実行したインストール方法も以下に記載しておきます。

``` bash
$ gem install tmuxinator
$ echo ' [[ -s $HOME/.tmuxinator/scripts/tmuxinator ]] && source $HOME/.tmuxinator/scripts/tmuxinator ' >> ${HOME}/.bashrc
$ source ${HOME}/.bashrc
```

tmuxinatorは環境変数 $EDITOR と $SHELL を参照するので、

設定していない場合は設定を行います。

``` bash
$ echo 'export EDITOR=/usr/bin/vim' >> ${HOME}/.bashrc
$ echo 'export SHELL=/bin/bash' >> ${HOME}/.bashrc
```

tmuxinatorを使用する準備が整ったかどうかは、

tmuxinator doctor コマンドで確認できます。

``` bash
$ tmuxinator doctor
  checking if tmux is installed ==> Yes
  checking if $EDITOR is set ==> Yes
  checking if $SHELL is set ==> Yes
```

また、tmuxinatorコマンドにはmuxというaliasが貼られているので、

mux doctor でも同様に確認できます。

以降はmuxコマンドを用いて説明していきます。

# <span style="text-decoration: underline;">設定方法</span>

tmuxinatorの設定を行なっていきます。

設定ファイルの作成は、mux new ${PROJECT_NAME} で行います。

コマンドを実行すると、環境変数で指定したエディタで設定ファイルが開かれます。

設定はyaml形式で記述していきます。

デフォルトの設定ファイルは以下のようになっていると思います。

``` yaml
# ~/.tmuxinator/Test.yml
# you can make as many tabs as you wish...

project_name: Tmuxinator
project_root: ~/code/rails_project
socket_name: foo # Not needed.  Remove to use default socket
rvm: 1.9.2@rails_project
pre: sudo /etc/rc.d/mysqld start
tabs:
  - editor:
      layout: main-vertical
      panes:
        - vim
        - #empty, will just run plain bash
        - top
  - shell: git pull
  - database: rails db
  - server: rails s
  - logs: tail -f logs/development.log
  - console: rails c
  - capistrano:
  - server: ssh me@myhost
```

rvm: の後にバージョンを指定する事で、

プロジェクトで使用するRubyのバージョンを選べます。

pre: の後にコマンドを記述する事で、

プロジェクトを起動する前に実行するコマンドを指定する事が出来ます。

tabs: の後にプロジェクトで起動するウィンドウを記述する事が出来ます。

```
tabs:
  - shell: git pull
  - database: rails db
  - server: rails s
```

- WINDOW名 : 実行コマンド

のように記述していきます。

``` yaml
- editor:
      layout: main-vertical
      panes:
        - vim
        - #empty, will just run plain bash
        - top
```

このように記述した場合、main-verticalレイアウトで3つのpaneが開かれます。

Railsの設定ファイルの例は、

本記事の上部で紹介したブログを参考にされるといいかと思います。

# **<span style="text-decoration: underline;">djangoの例</span>**

参考までに、僕が使用しているdjangoの開発環境での設定ファイルを紹介します。

``` yaml
# ~/.tmuxinator/test.yml
# you can make as many tabs as you wish...

project_name: Test
project_root: /path/to/project
pre: pgrep mysqld || mysqld_safe --log-error=${HOME}/mysqld_error.log &
tabs:
  - shell:
      layout: main-vertical
      panes:
        - ls
        - python manage.py shell
        - python manage.py runserver
  - models: cd application/ && vim models.py
  - view: cd views/
  - template: cd templates/
  - js: cd assets/js/
```

プロジェクトを開始する際は mux ${PROJECT_NAME} で起動します。

上記ファイルで mux Testを行うと、以下のようにtmuxが起動します。

[<img class="alignnone size-full wp-image-452" alt="tmuxinator" src="/images/blog/tmuxinator.png" width="599" height="337" />][6]

2番目のウィンドウでは vim  models.py が実行されて、

3,4,5番目のウィンドウでは指定のパスにcdしている状態です。

# **<span style="text-decoration: underline;">運用の例</span>**

続いて運用の際の例です。

障害が発生した時に、

「Webサーバ入って、ロードアベレージ見て、プロセス見て、ログ見て…。

あ、DBサーバにも入らなきゃ…

DBサーバでもロードアベレージ見て、プロセス見て…。

そういえばアプリケーションサーバの調子はどうだろうか…。」

みたいなことはよくある話ですね。tmuxinatorでコマンド1発にしてみましょう。

以下のように設定ファイルを記述します。

``` yaml
# ~/.tmuxinator/example.yml
# you can make as many tabs as you wish...

project_name: Example
project_root: ~/
tabs:
  - web_front:
      layout: main-vertical
      panes:
        - ssh web-01
        - ssh web-01 -t sudo less /var/log/nginx/error.log$(date +%Y%m%d)
        - ssh web-01 -t top
  - app:
      layout: main-vertical
      panes:
        - ssh app-01
        - ssh app-01 -t top
  - db:
      layout: main-vertical
      panes:
        - ssh db-01
        - ssh db-01 -t mysql -u root -p
        - ssh db-01 -t sudo less /var/lib/mysql/error.log
```

mux example してやると以下のようになります。

[<img class="alignnone size-full wp-image-453" alt="tmuxinator_example" src="/images/blog/tmuxinator_example.png" width="600" height="337" />][7]

&nbsp;

もちろん2番目のwindowではappサーバにログインし、

3番目のwindowではdbサーバにログインしている状態になっています。

&nbsp;

どうだったでしょうか。tmuxinator、みなさん是非使ってみて下さい。

※ ちなみにscreenで同じ事をする [screeninator ][8]もあります。

 [1]: http://tmux.sourceforge.net/
 [2]: http://www.gnu.org/software/screen/
 [3]: http://atnd.org/events/22320
 [4]: https://github.com/aziz/tmuxinator/
 [5]: http://qiita.com/items/869b00fdde27c2225989
 [6]: http://rrreeeyyy.com/images/blog/tmuxinator.png
 [7]: http://rrreeeyyy.com/images/blog/tmuxinator_example.png
 [8]: https://github.com/jondruse/screeninator
