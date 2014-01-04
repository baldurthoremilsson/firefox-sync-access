/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
(c) 2013 by Baldur Emilsson
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base32 encoding strategy.
     */
    var Base32 = C_enc.Base32 = {
        /**
         * Converts a word array to a Base32 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base32 string.
         *
         * @static
         *
         * @example
         *
         *     var base32String = CryptoJS.enc.Base32.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            var nBytes = 0;
            var shift = 32;
            var base32Chars = [];
            for (var i = 0; nBytes < wordArray.sigBytes; i++) {
                var bits;
                shift -= 5;
                if (shift < 0) {
                    bits = words[nBytes >>> 2] << (shift * -1);
                    shift += 32;
                    bits |= words[(nBytes + 1) >>> 2] >>> shift;
                }
                else
                    bits = words[nBytes >>> 2] >>> shift;
                base32Chars.push(map.charAt(bits & 0x1f));

                if (i % 8 == 1 || i % 8 == 3 || i % 8 == 4 || i % 8 == 6 || i % 8 == 7)
                    nBytes++;
            }

            // Add padding
            var paddingChar = map.charAt(32);
            if (paddingChar) {
                while (base32Chars.length % 8) {
                    base32Chars.push(paddingChar);
                }
            }

            return base32Chars.join('');
        },

        /**
         * Converts a Base32 string to a word array.
         *
         * @param {string} base32Str The Base32 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base32.parse(base32String);
         */
        parse: function (base32Str) {
            // Shortcuts
            var base32StrLength = base32Str.length;
            var map = this._map;

            // Ignore padding
            var paddingChar = map.charAt(32);
            if (paddingChar) {
                var paddingIndex = base32Str.indexOf(paddingChar);
                if (paddingIndex != -1) {
                    base32StrLength = paddingIndex;
                }
            }

            // Convert
            var words = [];
            var nBytes = 0;
            var shift = 32;
            for (var i = 0; i < base32StrLength; i++) {
                var bits = map.indexOf(base32Str.charAt(i));
                shift -= 5;

                if (shift < 0)
                    bits >>>= (shift * -1);
                else
                    bits <<= shift;

                words[nBytes >>> 2] |= bits;

                if (shift < 0) {
                    shift += 32;
                    bits = map.indexOf(base32Str.charAt(i));
                    bits <<= shift;
                    words[(1 + nBytes) >>> 2] |= bits;
                }

                if(i % 8 == 1 || i % 8 == 3 || i % 8 == 4 || i % 8 == 6 || i % 8 == 7)
                    nBytes++;
            }

            return WordArray.create(words, nBytes);
        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567='
    };
}());
