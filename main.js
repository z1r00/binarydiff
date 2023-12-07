(function () {
  function showMainPage() {
    document.getElementById('main').className = 'container';  // remove class 'hide'    
    document.getElementById('loading').className += ' hide';  // add class 'hide'
    document.getElementById('files').className = 'container';  // remove class 'hide'
    document.getElementById('gist_details').className = 'container';  // remove class 'hide'
  }

  function showError(message) {
    document.getElementById('alert-box').innerHTML
      += '<div class="alert alert-danger">'
      + '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
      + message
      + '</div>';
  }

  // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  function addGistDetails(info) {
    var html = `<h4>Gist Details:</h4><ul>`

    print_keys = ['html_url', 'description', 'id', 'created_at', 'updated_at']

    for (var item in info) {
      if (print_keys.includes(item)) {

        var line;
        if (item.includes('url')) {
          line = `<li>${item} : <a href="${info[item]}" target="_blank" rel="noopener">${info[item]}</a> </li><br>`;
        } else {
          line = `<li>${item} : ${info[item]} </li><br>`;
        }

        html += line;
      }

    }

    document.getElementById('gist_details').innerHTML = html;

  }


  function addFilesToList(info) {
    var query = document.getElementById('gist_id').value;
    var files = info.files;
    var html = `<h4>Files from Gist: <span class="badge">${Object.keys(files).length}</span></h4><ul>`

    for (var file in info.files) {
      //console.log(file);
      var raw_url = files[file]['raw_url']
      let line = `<li><a  target="_blank" rel="noopener" href="?${query}/${file}">${file}</a> (${formatBytes(parseInt(files[file].size / 1024))}) [<a href="${raw_url}">raw_gist</a>] </li><br>`;
      html += line;
    }

    html += '</ul>'

    document.getElementById('files').innerHTML = html;

  }

  function submit() {
    var query = document.getElementById('gist_id').value;
    var fileName = document.getElementById('file_name').value;
    if (fileName) {
      query += '/' + fileName;
    }
    location.search = query;  // page will be refreshed
  }

  async function fetchUrl(raw_url) {
    const response = await fetch(raw_url);
    // waits until the request completes...
    console.log(response);
    return response;
  }

  function processContent(content, fileName) {
    console.log(fileName)



    var targetElement = document.getElementById('myDiffElement');

    var fileExt = fileName.split('.').pop();

    switch (fileExt) {

      case 'diff':
        // code block

        var configuration = {
          drawFileList: true,
          fileListToggle: true,
          fileListStartVisible: true,
          fileContentToggle: true,
          matching: 'lines',
          outputFormat: 'side-by-side',
          synchronisedScroll: true,
          highlight: true,
          renderNothingWhenEmpty: false,
          diffStyle: 'char',
          fileContentToggle: true,
          rawTemplates: { "tag-file-changed": '<span class="d2h-tag d2h-changed d2h-changed-tag">MODIFIED</span>' }
          //highlightLanguages: { '856 Meta': 'c' }
        };

        // use diff2html to show standard diff
        var diff2htmlUi = new Diff2HtmlUI(targetElement, content, configuration);
        diff2htmlUi.draw();
        diff2htmlUi.highlightCode();

        break;
      case 'md':
        // code block
        showdown.setOption('moreStyling', true);
        showdown.setOption('simpleLineBreaks', true);
        showdown.setOption('tables', true);
        showdown.setFlavor('github');

        //var converter = new showdown.Converter({ extensions: ['mermaid'] });
        var converter = new showdown.Converter({ extensions: ['diff'] });

        html = converter.makeHtml(content);

        var configuration = {
          drawFileList: true,
          fileListToggle: true,
          fileListStartVisible: true,
          fileContentToggle: true,
          matching: 'lines',
          outputFormat: 'side-by-side',
          synchronisedScroll: true,
          highlight: true,
          renderNothingWhenEmpty: false,
          diffStyle: 'char',
          fileContentToggle: true,
          //highlightLanguages: { '856 Meta': 'c' }
        };


        // use diff2html to show standard diff
        var diff2htmlUi = new Diff2HtmlUI(targetElement, html, configuration);
        diff2htmlUi.draw();

        // force c syntax
        const files = diff2htmlUi.targetElement.querySelectorAll('.d2h-file-wrapper');
        files.forEach(file => {
          const language = file.getAttribute('data-lang');
          file.setAttribute('data-lang', 'c')
          console.log(language);
        });

        const elems = diff2htmlUi.targetElement.querySelectorAll('.d2h-ins.d2h-change:not(.d2h-code-side-linenumber)');
        elems.forEach(elem => {

          elem.className = 'd2h-change'
        });

        const elems2 = diff2htmlUi.targetElement.querySelectorAll('.d2h-del.d2h-change:not(.d2h-code-side-linenumber)');
        elems2.forEach(elem => {
          elem.className = 'd2h-change'
        });






        diff2htmlUi.highlightCode();

        break;
      case 'html':
        // code block
        targetElement.innerHTML = content;

        break;
      default:
        // code block
        throw new Error('Unsupported file extension <strong>' + fileExt + '</strong>, ');
    }








    showMainPage();

  }

  document.getElementById('submit').onclick = submit;
  document.onkeypress = function (e) {
    if (e.keyCode === 13) submit();
  }

  // 1. check query string
  var query = location.search.substring(1);
  if (query.length === 0) {
    showMainPage();
    return;
  }

  // 2. get gist id and file name
  query = query.split('/');
  var gistId = query[0];
  var fileName = decodeURIComponent(query[1] || '');

  // 3. write data to blank
  document.getElementById('gist_id').value = gistId;
  document.getElementById('file_name').value = fileName;

  // 4. fetch data
  fetch('https://api.github.com/gists/' + gistId)
    .then(function (res) {
      return res.json().then(function (body) {
        if (res.status === 200) {
          return body;
        }
        //console.log(res, body); // debug
        throw new Error('Gist <strong>' + gistId + '</strong>, ' + body.message.replace(/\(.*\)/, ''));
      });
    })
    .then(function (info) {


      addGistDetails(info);
      addFilesToList(info);

      if (fileName === '') {
        for (var file in info.files) {
          // index.html or the first file
          if (fileName === '' || file === 'index.html') {
            fileName = file;
          }
        }
      }

      if (info.files.hasOwnProperty(fileName) === false) {
        throw new Error('File <strong>' + fileName + '</strong> is not exist');
      }

      if (info.files[fileName].truncated) {
        fetchUrl(info.files[fileName].raw_url).then(res => {

          // The API call was successful!
          if (res.status === 200) {
            res.text().then(text => processContent(text, fileName))
          }
          else {
            //console.log(res, body); // debug
            throw new Error('Failed to pull full content' + fileName + ' <strong>' + gistId + '</strong>, ' + res.status);
          }

        })


      }
      //response not truncated
      else {
        processContent(info.files[fileName].content, fileName);
      }

    })
    .catch(function (err) {
      showMainPage();
      showError(err.message);
    });
})();
