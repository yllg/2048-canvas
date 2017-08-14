$.fn.make2048 = function(option){
	//设置默认参数
	var defaultOption = {
		width: 4,
		height: 4,
		style: {
			background_color: "rgb(184,175,158)",
			block_background_color: "rgb(204,192,178)",
			padding: 18,
			block_size: 100,
			block_style: {
				"font-family": "微软雅黑",
				"font-weight": "bold",
				"text-align": "center"
			}
		},
		blocks:[
			{level: 0, value: 2, style: {"background-color": "rgb(238,228,218)",  "color": "rgb(124,115,106)", "font-size": 58 }},
			{level: 1, value: 4, style: {"background-color": "rgb(236,224,200)",  "color": "rgb(124,115,106)", "font-size": 58 }},
			{level: 2, value: 8, style: {"background-color": "rgb(242,177,121)",  "color": "rgb(255,247,235)", "font-size": 58 }},
			{level: 3, value: 16, style: {"background-color": "rgb(245,149,99)",  "color": "rgb(255,250,235)", "font-size": 50 }},
			{level: 4, value: 32, style: {"background-color": "rgb(244,123,94)",  "color": "rgb(255,247,235)", "font-size": 50 }},
			{level: 5, value: 64, style: {"background-color": "rgb(247,93,59)",  "color": "rgb(255,247,235)", "font-size": 50 }},
			{level: 6, value: 128, style: {"background-color": "rgb(236,205,112)",  "color": "rgb(255,247,235)", "font-size": 42 }},
			{level: 7, value: 256, style: {"background-color": "rgb(237,204,97)",  "color": "rgb(255,247,235)", "font-size": 42 }},
			{level: 8, value: 512, style: {"background-color": "rgb(236,200,80)",  "color": "rgb(255,247,235)", "font-size": 42 }},
			{level: 9, value: 1024, style: {"background-color": "rgb(237,197,63)",  "color": "rgb(255,247,235)", "font-size": 34 }},
			{level: 10, value: 2048, style: {"background-color": "rgb(238,194,46)",  "color": "rgb(255,247,235)", "font-size": 34 }},
			{level: 11, value: 4096, style: {"background-color": "rgb(61,58,51)",  "color": "rgb(255,247,235)", "font-size": 34 }}
		],
		animateSpeed: 300
	}
	var state = [];  //用来保存游戏数据

	//如果没传option就用默认default的，传了就会覆盖
	option = $.extend({}, defaultOption, option);
	console.log("游戏配置",option);
	//确保每次进行游戏的数量为1
	if(this.length > 1)  throw "一次只能开始一个游戏"
	if(this.length =0)  throw "未找到游戏容器"

	//给整个背景设置样式
	var $this = $(this[0]);
	$this.css({
		"background-color":  option.style.background_color,
		"border-radius":  option.style.padding,
		"position":  "relative",
		"-webkit-user-select":  "none"
	})

	//获得索引对应的坐标的方法
	var getCoordinate = function(index){
		return {
			x: index % option.width,
			y: Math.floor( index / option.width )
		}
	}

	//根据坐标得索引
	var getIndex = function(x, y){
		return  x + y * option.width ;
	}

	//根据坐标计算小方块位置的方法
	var getPosition = function(x,y){
		return{
			//y从0开始，不用减一，每次增加一个块高度和padding
			"top": option.style.padding + y  *(option.style.block_size + option.style.padding),
			"left": option.style.padding + x  *(option.style.block_size + option.style.padding)
		}
	}

	//得到所有的空数字块
	var getEmptyBlockIndex = function(){
		var emptyBlockIndexs = [];
		$(state).each(function(i,o){
			if(o == null)   emptyBlockIndexs.push(i);
		})
		return emptyBlockIndexs;
	}

	//移动方法遍历中得到每个小方块的方法,,state对象数组中的对象哦。
	var getBlock = function(x, y){
		return state[getIndex(x, y)];
	}

	//创建整个有个所有小方块，并加进背景中，背景手动设置宽和高
	var buildBackground = function(){
		var backgrounds = [];
		for (var x=0; x<option.width; x++){
			for(var y=0; y<option.height; y++){
				state.push(null);//最开始时所有的空格都没有数据，是null
				var bg_block = $("<div></div>");
				var position = getPosition(x,y);
				bg_block.css({
					"width": option.style.block_size,
					"height": option.style.block_size,
					"background-color": option.style.block_background_color,
					"position": "absolute",
					"top": position.top,
					"left": position.left
				})
				backgrounds.push(bg_block);
			}
		}
		$this.append(backgrounds);
		$this.width((option.style.block_size + option.style.padding) * option.width + option.style.padding)
		$this.height((option.style.block_size + option.style.padding) * option.height + option.style.padding)
	}

	//每次操作后，创建1个数字块的方法
	var buildBlock = function(level, x, y){
		var emptyBlockIndexs = getEmptyBlockIndex();
		if(emptyBlockIndexs.length == 0) return false;

		var putIndex;
		if( x != undefined && y != undefined){
			putIndex = getIndex(x, y)
		}else{
			//emptyBlockIndexs 应该类似 = [0,2,4]，通过math和取低函数获得该数组随机的下标
			putIndex = emptyBlockIndexs[Math.floor(Math.random() * emptyBlockIndexs.length)];
		}
		if(state[putIndex] != null) throw "已经有块存在"
		//随机产生的数字块，做个重载，有传参按传参的来，没有就随机
		var block;
		if(level != undefined){
			block = $.extend({}, option.blocks[level]);
		}else{
			block = $.extend({}, Math.random() >= 0.5 ? option.blocks[0] :option.blocks[1]);
		}

		//根据索引获得位置坐标
		var coordinate = getCoordinate(putIndex);
		//再根据坐标获得这个块左上角的top和left
		var position = getPosition(coordinate.x, coordinate.y);
		var blockDom = $("<div></div>");
		blockDom.addClass("block_" + coordinate.x + "_" + coordinate.y);
		blockDom.css($.extend(option.style.block_style, {
			"position": "absolute",
			"top":position.top + option.style.block_size /2,  //除以2是为了得到小块的中心点
			"left":position.left + option.style.block_size /2,
			"width": 0,
			"height": 0
		}, block.style));
		//把生成的小方块加进去
		$this.append(blockDom);
		//注意要保存游戏数据，state数组里存的是各个小快的对象哦，对象数组
		state[putIndex] = block;
		//让它生成的时候有个动画效果，从中间一个点变到设定的大小
		blockDom.animate({
			"width": option.style.block_size,
			"height": option.style.block_size,
			"top": position.top,
			"left": position.left,
			"line-height": option.style.block_size + "px"
		}, option.animateSpeed, (function(blockDom){
			return function(){
				blockDom.html(block.value); //使用闭包，生成好了，赋值显示数字
			}
		})(blockDom))

		//空格长度只有一个，此时上面已经生成了一个，也就是所有空格都填满的时候，判断还能不能消除；
		//遍历所有的块，和它周围左右上下有相同数能合并么？
		//不能合并，能合并则设置canMove，或者执行结束方法gameEnd
		 if(emptyBlockIndexs.length == 1){
		      var canMove = false;
		      for(var x=0; x<option.width-1 && !canMove; x++) {
		        for(var y=0; y<option.height-1 && !canMove; y++){
		          if(x > 0 && state[getIndex(x - 1, y)].value == state[getIndex(x, y)].value){
		            canMove = true; 
		          }
		          if(x < option.width && state[getIndex(x + 1, y)].value == state[getIndex(x, y)].value){
		            canMove = true;
		          }
		          if(y > 0 && state[getIndex(x, y - 1)].value == state[getIndex(x, y)].value){
		            canMove = true;
		          }
		          if(y < option.height && state[getIndex(x, y + 1)].value == state[getIndex(x, y)].value){
		            canMove = true;
		          }
		        }
		      }
		      if(!canMove){
		        gameEnd();
		        return false;
		      }
		    }

		return true;
	}


	//保留上次移动的事件，判断用户操作过快就返回
	var lastMovedTime = 0;

	//移动的方法
	var move = function(direction){
		if(new Date() - lastMovedTime < option.animateSpeed + 20) return;
	        lastMovedTime = new Date();
	        //将四个方向的移动函数合并，switch只设置6个状态位
	        var startX,startY,endX, endY, modifyX,modifyY;
	        //判断操作结果是否成功，true的话执行buildBlock方法，创建个新数字块
	        var doActioned = false;
		//根据方向设置6个状态参数
		switch(direction){
		      case "up":  //向上，X从最左到最右，Y从第二行到最下，目标位置向上，偏移量x为0 y为-1
		        startX = 0;
		        endX = option.width - 1;
		        startY = 1;
		        endY = option.height - 1;
		        modifyX = 0;
		        modifyY = -1;
		        break;
		      case "down":  //向下，X从最左到最右，Y从倒二行到最上，目标位置向下偏移量x为0 y为+1
		        startX = 0;
		        endX = option.width - 1;
		        startY = option.height - 2;
		        endY = 0;
		        modifyX = 0;
		        modifyY = 1;
		        break;
		      case "left":  //向左，X从第二列1到最右，Y从最上到最下，目标位置向左偏移量x为-1 y为0
		        startX = 1;
		        endX = option.width - 1;
		        startY = 0;
		        endY = option.height - 1;
		        modifyX = -1;
		        modifyY = 0;
		        break;
		      case "right":   //向右，X从倒二列到最左0，Y从最上到最下，目标位置向右偏移量x为+1 y为0
		        startX = option.width - 2;
		        endX = 0;
		        startY = 0;
		        endY = option.height - 1;
		        modifyX = 1;
		        modifyY = 0;
		        break;
		}
		
		//开始循环遍历处理，分三种情况，到头了还是空；目标和我值相同；目标和我的值不同
		for(var x = startX; x <= Math.max(startX, endX) && x >= Math.min(startX, endX); endX > startX ? x++ : x--){
		      for(var y = startY; y <= Math.max(startY,endY) && y >= Math.min(startY, endY); endY > startY ? y++ : y--){
		      //得到循环的当前块，空就继续
		        var block = getBlock(x, y);
		        if(block == null) continue;
		        //初始化目标块的坐标，后面会修改
		        var target_coordinate = {x:x, y:y};
		        var target_block;
		        var moved = 0;  //设置移动次数变量
		        //像目标节点移动的过程中，有空继续移动的处理方法
		        do{ //do循环，先执行do再判断，只要目标块为空，就继续偏移
		          if(++moved > Math.max(option.width, option.height)) break; //移动次数超出就退出
		          target_coordinate.x += modifyX;
		          target_coordinate.y += modifyY;
		          target_block = getBlock(target_coordinate.x, target_coordinate.y);
		          if(direction == "up" || direction == "down"){
		          	  //向上或向下到了边界，退出循环
		            if(target_coordinate.y == 0 || target_coordinate.y == option.height - 1) break;
		          }
		          if(direction == "left" || direction == "right"){
		          	  //向左或向右到了边界，退出循环
		            if(target_coordinate.x == 0 || target_coordinate.x == option.width - 1) break;
		          }
		        }while(target_block == null)

		        //开始进行dom操作，获得本块的dom
		        var blockDom = $(".block_" + x + "_" + y);
		        
		        //第一种情况，目标块为空，直接移上去
		        if(target_block == null){
		          var position = getPosition(target_coordinate.x, target_coordinate.y);
		         //更改数据，本块数据清空，目标块数据设置为本块
		         state[getIndex(x, y)] = null;
		          state[getIndex(target_coordinate.x, target_coordinate.y)] = block;
		         //本dom移除旧类名，添加新类名，移动位置并给个动画
		          blockDom.removeClass();
		          blockDom.addClass("block_" + target_coordinate.x + "_" + target_coordinate.y)
		          blockDom.animate({
		            "top": position.top,
		            "left": position.left
		          }, option.animateSpeed)
		        }

		        //第二种情况，目标块和本块值相同，而且目标块不是刚被修改过的
		        else if(target_block.value == block.value && !target_block.justModified)
		        { var position = getPosition(target_coordinate.x, target_coordinate.y);
		          //更新的block的level要加一
		          var updatedBlock = $.extend({}, option.blocks[block.level + 1]);
		          if(updatedBlock.level == option.blocks.length - 1){
		           //更新之后的值为4096，达到顶级的块，就结束
		           gameEnd();
		          }
		          //增加刚修改的状态，并更新数据
		          updatedBlock.justModified = true;
		          state[getIndex(x, y)] = null;
		          state[getIndex(target_coordinate.x, target_coordinate.y)] = updatedBlock;
		          
		          //处理dom，本块只是做个移动的动画然后被删除remove，然后将目标dom的内容和样式改为update的。
		          var target_blockDom = $(".block_" + target_coordinate.x + "_" + target_coordinate.y);
		          blockDom.animate({
		            "top": position.top,
		            "left": position.left
		          }, option.animateSpeed, (function(blockDom, target_blockDom, target_coordinate, updatedBlock){
		            return function(){
		              blockDom.remove();
		              target_blockDom.html(updatedBlock.value);
		              target_blockDom.css(updatedBlock.style);
		            };
		          }(blockDom, target_blockDom, target_coordinate, updatedBlock)))
		        }

		        //第三中情况，目标块和本块值不相同，
		        else if(target_block.value != block.value || moved > 1){
		          //目标块的坐标，要退回一个偏移量
		          target_coordinate.x = target_coordinate.x - modifyX;
		          target_coordinate.y = target_coordinate.y - modifyY;
		          //如果本来已经到了目标块的位置，跳出本次循环，继续循环
		          if(target_coordinate.x == x && target_coordinate.y == y) continue;
		          //然后dom操作和第一种情况类似
		          var position = getPosition(target_coordinate.x, target_coordinate.y);
		          state[getIndex(x, y)] = null;
		          state[getIndex(target_coordinate.x, target_coordinate.y)] = block;
		          blockDom.removeClass();
		          blockDom.addClass("block_" + target_coordinate.x + "_" + target_coordinate.y)
		          blockDom.animate({
		            "top": position.top,
		            "left": position.left
		          }, option.animateSpeed)
		        }else{ //如果以上情况都不满足，跳出本次循环，继续
		          continue;
		        }
		        doActioned = true;  //每一小个遍历，设置动作为true
		      }
		    }   //两层for遍历结束

		    //遍历所有的块，把刚刚修改属性删除
	     for(var x=0; x<option.width; x++){
	        for(var y=0; y<option.height; y++){
	         var block = getBlock(x, y);
	         if(block == null) continue;
	         delete block.justModified;
 		}
	       }
	       //move方法最后，如果move的操作成功，再生成一个新数字块
	       if(doActioned) {
		      buildBlock();
		    }
	}

	//键盘操作的处理事件
	  var keyHandler = function(evt){
	    switch(evt.which){
	      case 38:
	        move("up");
	        break;
	      case 40:
	        move("down");
	        break;
	      case 37:
	        move("left");
	        break;
	      case 39:
	        move("right");
	        break;
	    }
	  }


	  //鼠标操作的处理事件
	  var mouseStartPoint = null;
	  var mouseHandler = function(evt){
	  	    //鼠标按下记下开始的坐标
		    if(evt.type == "mousedown" && mouseStartPoint == null){
		      mouseStartPoint = {x: evt.pageX, y: evt.pageY};
		    }
		    //鼠标抬起进行计算判断
		    if(evt.type == "mouseup"){
		      var xDistance = evt.pageX - mouseStartPoint.x;
		      var yDistance = evt.pageY - mouseStartPoint.y;
		      //设置最少滑动的距离值，以免误碰等情况
		      if(Math.abs(xDistance) + Math.abs(yDistance) > 20){
		         //如果X方向距离大于Y方向，来判断X轴的移动，大于0向右
		        if(Math.abs(xDistance) >= Math.abs(yDistance)){
		          if(xDistance > 0){
		            move("right");
		          }else{
		            move("left");
		          }
		        }else{  //Y方向距离大于X方向，y轴差值大于0向下哦。
		          if(yDistance > 0){
		            move("down");
		          }else{
		            move("up");
		          }
		        }
		      }
		      mouseStartPoint = null; //每次滑动事件结束开始坐标清空
		    }
	  }


 	 // H5原生touch事件，处理手指滑动的判断事件。有bug，用hammer手势库
	  var fingerStartPoint = null;
	  var fingerHandler = function(evt){
	  	    //手指按下记下开始的坐标
		    if(evt.type == "touchstart" && fingerStartPoint == null){
		      evt.preventDefault();
		      fingerStartPoint = {x: evt.targetTouches[0].pageX, y: evt.targetTouches[0].pageY};
		    }
		    //手指抬起进行计算判断
		    if(evt.type == "touchmove"){
		      evt.preventDefault();
		      var xDistance = evt.targetTouches[0].pageX - fingerStartPoint.x;
		      var yDistance = evt.targetTouches[0].pageY - fingerStartPoint.y;
		      //设置最少滑动的距离值，以免误碰等情况
		      if(Math.abs(xDistance) + Math.abs(yDistance) > 10){
		         //如果X方向距离大于Y方向，来判断X轴的移动，大于0向右
		        if(Math.abs(xDistance) >= Math.abs(yDistance)){
		          if(xDistance > 0){
		            move("right");
		          }else{
		            move("left");
		          }
		        }else{  //Y方向距离大于X方向，y轴差值大于0向下哦。
		          if(yDistance > 0){
		            move("down");
		          }else{
		            move("up");
		          }
		        }
		      }
		      fingerStartPoint = null; //每次滑动事件结束开始坐标清空
		    }
	  }


	//hammer手势库，创建一个新的hammer对象并且在初始化时指定要处理的dom元素
	var hammertime = new Hammer(document.getElementById("game"));
	//默认上下滑动没开启，设置ALL所有方向都开启
	hammertime.get('swipe').set({direction: Hammer.DIRECTION_ALL});
	


	//游戏开始的方法
	var gameStart = function(){
	    ///绑定事件代理
	    $(document).on("keydown",keyHandler);
	    $(document).on("mousedown",mouseHandler);
	    $(document).on("mouseup",mouseHandler);
	    //移动端的上下左右操作
	    hammertime.on("swipeleft", function () {move("left");});
	    hammertime.on("swiperight", function () {move("right");});
	    hammertime.on("swipeup", function () {move("up");});
	    hammertime.on("swipedown", function () {move("down");});

	    //整个清空，初始化数据为空
	    $this.html('');
	    state = [];

	    buildBackground();
	    buildBlock();
	    buildBlock();

	    //手动生成数字块，测试游戏结束状态，向下结束
	    // buildBlock(11,0,0);
	    // buildBlock(5,1,0);
	    // buildBlock(3,2,0);
	    // buildBlock(10,3,0);
	    // buildBlock(2,0,1);
	    // buildBlock(7,1,1);
	    // buildBlock(6,2,1);
	    // buildBlock(9,3,1);

	    // buildBlock(8,0,2);
	    // buildBlock(9,2,2);
	    // buildBlock(4,3,2);
	    // buildBlock(5,0,3);
	    // buildBlock(9,1,3);
	    // buildBlock(10,2,3);
	    // buildBlock(8,3,3);

	    console.log("游戏开始");
	  }


	//游戏结束的方法
	var gameEnd = function(){
	     //移除事件绑定，不能再触发了
	    $(document).off("keydown",keyHandler);
	    $(document).off("mousedown",mouseHandler);
	    $(document).off("mouseup",mouseHandler); 
	   //计算用户的分数，把state的所有值value相加
	   //这里用level，2的level+1次幂的value
	    var score = 0;
	    for(var i=0; i<state.length; i++){
	      if(state[i] == null) continue;
	      // score += Math.pow(2, state[i].level + 1);
	      score += state[i].value; //两种方式一样的
	    }
	    console.log("游戏结束, 您的分数为:", score);
	    

	    //创建结束提示的一个根div
	    var $endMask = $("<div></div>");
	    // 创建一个遮罩
	    var $mask = $("<div></div>")
	    $mask.css({
	      "background-color": option.style.background_color,
	      "border-radius": option.style.padding,
	      "position": "absolute",
	      "-webkit-user-select": "none",
	      "opacity": 0.5,
	      "width": $this.width(),
	      "height": $this.height()
	    })

	    // 结束游戏提示框
	    var $content = $("<div ></div>");
	    var $title = $("<h1 >游戏结束</h1>");
	    var $result = $("<p >您的分数为: <span>" + score + "</span></p>");
	    var $again = $("<button >再玩一次</button>");
	    $again.click(function(evt){
	      evt.preventDefault();
	      gameStart();
	    })
	    $content.css({
	      "width": "330px",
	      "height": "330px",
	      "text-align": "center",
	      "font-size": "25px",
	      "line-height": "40px",
	      "margin": "0 auto",
	      "position": "absolute",
	      "top": "50%",
	      "transform": "translate(-50%, -50%)",
	      "left": "50%",
	      "box-sizing": "border-box",
	      "padding": "90px 0" ,
	      "background-color": option.style.block_background_color
	    })

	    //注意要先append遮罩，再append内容，不然内容会被盖住；或者设置z-index就没事
	    $endMask.append($mask); 
	    $content.append($title);
	    $content.append($result);
	    $content.append($again);
	    $endMask.append($content);

	    $this.append($endMask);
	  }



gameStart();


}