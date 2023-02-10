---
title: '#12 djangoにて、AjaxでPOSTをする'
author: rrreeeyyy
categories:
  - Python
comments: true
pubDate: 2013/01/03
---
皆さんあけましておめでとうございます。
2013年もどうぞよろしくお願いします、れいです。

さて、へび年です。
へびと言えば？

…そう。[Python][1]ですよね。

今日はdjangoのちょっとしたメモを残します。ただの備忘録になってますが。
<!--more-->

PythonのWebフレームワークと言えばお馴染み[Django][2]
[Pyramid][3]もありますが、今日はdjangoの話です。

さて、djangoは1.2系から[CSRF][4]を防ぐために、csrf_tokenを導入しています。

HTMLのformでPOSTをする際には、テンプレートに以下のように書かなければなりません。

``` html
<form action="#" method="POST">{\% csrf_token \%}
  <input type= ...
```

こんな風に書くと、実際のhtmlは以下のように出力されます。

``` html
<form action="#" method="POST">
<div style='display:none'>
<input type='hidden' name='csrfmiddlewaretoken' value='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' />
</div>
```

ところで、時代はAjaxです。
非同期で、対話的で、ダイナミックで、リアルタイムなウェブサイトを作るためには、
Ajaxの力を借りるのが一般的でしょう。

こんな風にしましょう

``` html
<input type="text" id="test" \>
<input type="data" id="data" \>
```

これを別のページにPOSTして、
その結果をresultというIDに入れたい！

おそらく、こう書くでしょう。

``` javascript
$("#result").load("/other/page",
 { 'test' : $('#test').val() ,
   'data' : $('#data').val() });
```

ところが、これではdjangoに怒られて、403が帰ってきてしまいます。
それもそのはず、csrf_tokenが無いからです。

対策はいくつかありそうですが、こんなのが推奨されていました。
jQueryのAjaxSend関数を以下のようにする方法です。

``` javascript
jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
```

何をしているのかというと、XMLHttpRequestに対し、
X-CSRFTokenヘッダの値にcsrftokenの値を付加しています。
(※jQuery1.5以上でしか動作しない模様です)

上記のスクリプトを、ajaxを利用するスクリプトファイルの上部に記述しましょう。
そうすると、特に何も考えずにdjangoのページにAjaxでPOSTすることが出来るようになります。

これで皆さんはdjangoを使って簡単に、
そしてAjaxを使って対話的に、ダイナミックに、インタラクティブに、
Webサイトを作ることが出来るでしょう:-)
(※個人の能力によります)

さて、今日書いた事は実は[ここ][5]に書いてあります。
こちらを読むほうが正確でしょう。

へび年なので、新年の挨拶がてらpythonネタを書いてみたかっただけです。
しかしdjangoは本当に簡単でいいですね。
あとjQueryも最近覚え始めましたが、javascriptをベタ書きするより遥かに楽ですごくいいですね。

それでは。

 [1]: http://ja.wikipedia.org/wiki/Python
 [2]: http://ja.wikipedia.org/wiki/Django
 [3]: http://docs.pylonsproject.jp/projects/pyramid-doc-ja/en/latest/index.html
 [4]: http://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA
 [5]: https://docs.djangoproject.com/en/dev/ref/contrib/csrf/
