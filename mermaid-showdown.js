/**
 * Support for Mermaid in Showdown
 */
(function (extension) {
    'use strict';

    if (typeof showdown !== 'undefined') {
        // global (browser or nodejs global)
        extension(showdown);
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['showdown'], extension);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = extension(require('showdown'));
    } else {
        // showdown was not found so we throw
        throw Error('Could not find showdown library');
    }

}(function (showdown) {
    'use strict';

    var mermaidBlocks = [];

    /**
     * 
     * Support for mermaid.js
     */
    showdown.extension('mermaid', function () {
        return [
            {
                type: 'lang',
                regex: '(?:^|\\n)``` ?mermaid(.*)\\n([\\s\\S]*?)\\n```',
                replace: function (s, match) {
                    var thing = s.match('(?:^|\\n)``` ?mermaid(.*)\\n([\\s\\S]*?)\\n```');
                    var thing_group = thing.length - 1;
                    mermaidBlocks.push(thing[thing_group]);
                    var n = mermaidBlocks.length - 1;
                    return '%PLACEHOLDER' + n + '%';
                }
            },

            {
                type: 'output',
                filter: function (text) {
                    for (var i = 0; i < mermaidBlocks.length; ++i) {
                        var pat = '%PLACEHOLDER' + i + '%';
                        text = text.replace(new RegExp(pat, 'gi'), '<pre><div class="mermaid" id="mermaid_' + i + '">' + mermaidBlocks[i] + '</div></pre>');
                    }
                    //reset array3
                    mermaidBlocks = [];
                    return text;
                }
            }

        ];
    });
}));