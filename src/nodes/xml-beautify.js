const convert = require('xml-js');

module.exports = function(RED) {
    function BeautifyXml(config) {
        RED.nodes.createNode(this,config);
        this.spaces = config.spaces||4;
        var node = this;

        const beauty = (xml) => {
            var tmp = convert.xml2json(xml,{ compact:true });
            var res = convert.json2xml(tmp,{ compact:true, spaces: Number(this.spaces) });
            return res;
        };

        node.on('input', function(msg) {
            msg.payload = beauty(msg.payload);
            node.send(msg);
        });
    }
    RED.nodes.registerType("xml-beautify",BeautifyXml);
}
