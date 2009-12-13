
// Template 1: using client-side javascript

function RunParser() {
	var resultCount = "0"; // How many results
	var elapsedTime = "0"; // How long the search takes
	var results = [];      // The search results array
	
	// Part 1. get result summary
	// 
	// [How To Do It]
	//    resultCount and elapsedTime is in <p> (paragraph) whose id is "resultStats"
	//       Counting from 0, resultCount is the [1]-th <b> (bold) under "resultStats";
	//       elapsedTime is the [4]-th <b>.
	// [Example]
	// <p id="resultStats">
	//      ����
	//   <b>keydown</b>
	//      ���Լ
	//   <b>2,040,000</b>
	//      ������������ǵ�
	//   <b>1</b>
	//       -
	//   <b>10</b>
	//      ���� ����ʱ
	//   <b>0.35</b>
	//      �룩 
	// </p>
	try {
		// Note: 1) id should be unique in the document, 
		//          but name, tagName don't have such a restriction.
		//       2) document is the javascript object indicating root of the HTML do
		var resultStates = document.getElementById('resultStats');  
		var bArray = resultStates.getElementsByTagName('b');
		resultCount = bArray[1].innerHTML;
		elapsedTime = bArray[4].innerHTML;
		
		console.log("resultCount:" + resultCount);
		console.log("elapsedTime:" + elapsedTime);
	} catch (e) {
		alert(e); // alert error if exists. TODO: should be removed when release!
	}
	
	// Part 2. get search result
	// 
	// [How To Do It]
	//     the results are in container <div> whose id is "res"
	//     1) they are wrapped in [1]-th <div> then [0]-th <ol> (ordered list)
	//     2) each element is in <li> (list element)
	//        2.1) uri and title is in <h3> under <li>
	//        2.2) content, cachedUrl, similarUrl is in <div> under <li>
	//
	// [Example]
	//	<div id="res" class="med">
	//		<div id="trev" class="std" style="margin: 1em 0pt;"></div>
	//		<h2 class="hd">�������</h2>
	//		<div>
	//			<ol>
	//				<li class="g">
	//					<h3 class="r">
	//						<a class="l" onmousedown="return clk(this.href,'','','res','1','','0CAsQFjAA')" href="http://www.nihao.cn/">
	//							<em>���</em>
	//							��ά��������ע��|��������|��ҳ���|��վ�ƹ�|��ҵ����|רҵ������
	//						</a>
	//					</h3>
	//					<div class="s">
	//						�й�����������������ҵ����������ϯ�������,רҵ�ṩ��������,����ע��,��ҵ����,
	//						<wbr/>
	//						�����й�,��վ����,��ҳ���,��վ�ƹ�,����Ӫ��,����ʵ��,ͨ����ַ�ȷ���.
	//						<br/>
	//						<cite>www.nihao.cn/ - </cite>
	//						<span class="gl">
	//							<a onmousedown="return clk('http://74.125.153.132/search?q=cache:lbw9fgeHzl4J:www.nihao.cn/+%E4%BD%A0%E5%A5%BD&cd=1&hl=zh-CN&ct=clnk','','','clnk','1','')" href="http://74.125.153.132/search?q=cache:lbw9fgeHzl4J:www.nihao.cn/+%E4%BD%A0%E5%A5%BD&cd=1&hl=zh-CN&ct=clnk">
	//								��ҳ����
	//							</a>
	//							<a href="/search?hl=zh-CN&lr=&q=related:www.hi-bj.com/+%E4%BD%A0%E5%A5%BD&sa=X&ei=AR8lS7f3Bs6LkAWRsfGnAw&ved=0CBYQHzAC">
	//								���ƽ��
	//							</a>
	//						</span>
	//					</div>
	//				</li>
	//				<li> ...(another result) </li>
	//				<li> ...(another result) </li>
	//			</ol>
	//		<div>
	//	</div>
	try {
		var container = document.getElementById('res');
		var orderedList = container.getElementsByTagName('div')[1].getElementsByTagName('ol')[0];
		var items = orderedList.getElementsByTagName('li');
		
		// get results:
		for (var i = 0; i < items.length; i++) {
			var title = "";
			var url = "";
			var content = "";
			var cachedUrl = "";
			var similarUrl = "";
			
			try {
				var li = items[i];
				
				// get title and url
				var h3 = li.getElementsByTagName('h3')[0];
				var a = h3.getElementsByTagName('a')[0];
				title = a.text;
				url = a.href;
				
				// get content
				var div = li.getElementsByTagName('div')[0];
				content = div.innerHTML;
				
				// get cachedUrl and similarUrl
				var span = div.getElementsByTagName('span')[0];
				cachedUrl = span.getElementsByTagName('a')[0].href;
				similarUrl = span.getElementsByTagName('a')[1].href;
								
			} catch(e) {}
			
			console.log("title:" + title);
			console.log("url:" + url);
			console.log("content:" + content);
			console.log("cachedUrl:" + cachedUrl);
			console.log("similarUrl:" + similarUrl);
		}
	} catch (e) {
		alert(e);   // alert error if exists. TODO: should be removed when release!
	}
};

RunParser();


// Template 2: using javascript, with famous jQuery library
function RunParserWithjQuery() {
	var resultCount = "0"; // How many results
	var elapsedTime = "0"; // How long the search takes
	var results = [];      // The search results array
	
	// Part 1: 
	try {
		resultCount = jQuery('#resultStats > b:eq(1)').html();
		elapsedTime = jQuery('#resultStats > b:eq(4)').html();
	} catch (e) {
		alert(e);   // alert error if exists. TODO: should be removed when release!
	}
	
	try {
		var items = jQuery("#res > div:eq(1) > ol > li");
		
		for (var i = 0; i < liArray.length; i++) {
			var title = "";
			var url = "";
			var content = "";
			var cachedUrl = "";
			var similarUrl = "";
			
			try {
				var li = items[i];
				
				// get title and url
				var a = jQuery(li).find('h3 > a');
				title = a.text();
				url = a.attr("href");
				
				// get content
				var div = jQuery(li).find('div:eq(0)');
				content = div.text();
				
				// get cachedUrl and similarUrl
				var span = jQuery(div).find('span');
				cachedUrl = jQuery(span).find('a:eq(0)').attr("href");
				similarUrl = jQuery(span).find('a:eq(1)').attr("href");
			} catch(e) {}
			
			console.log("title:" + title);
			console.log("url:" + url);
			console.log("content:" + content);
			console.log("cachedUrl:" + cachedUrl);
			console.log("similarUrl:" + similarUrl);
		}
	} catch (e) {
		alert(e);   // alert error if exists. TODO: should be removed when release!
	}
};
RunParserWithjQuery();