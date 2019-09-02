angular.module('bookYourSeatApp', [])
	.factory('seats', SeatsFactory)
    .controller('mainCtrl', MainCtrl);

function SeatsFactory($rootScope, $timeout) {
	var seatProps = {
    	id: 0,
    	caption: 0,
        checked: false,
        booked: false
    };
	var seats = {
    	'firstRang': {
            //           col0 1 2 3 4  5 
        	// row 0 seat 0   1 2 3 4  5
            // row 1 seat 6   7 8 9 10 11
            seats: createSeats(11, 7) // rows, cols
        }
        /* 'secondRang': {
        	seats: createSeats(3, 6)
        } */
    };
    
    function createSeats(rows, cols) {
    	var arr = [[]];
        var seatIndex = 1;

        for (var row = 0; row < rows; row++) {
        	arr[row] = [];
            for(var col=0; col < cols; col++) {
            	var seat = angular.extend({}, seatProps, {
                	id: seatIndex,
                    caption: seatIndex,
                    booked: seatIndex < 5 // 0 to 5 booked
                });
				//console.log("seat....."+JSON.stringify(seat));
				
            	arr[row][col] = seat;
                seatIndex++;
            }
        }
		
		arr.push([{"id":78,"caption":78,"checked":false,"booked":false},
		{"id":79,"caption":79,"checked":false,"booked":false},
		{"id":80,"caption":80,"checked":false,"booked":false}]);
		//console.log("arr....."+JSON.stringify(arr));
        return arr;
    }
    
	function checkSelected(newCount) {
    	// selected fewer or more than persons in select.
        // --> uncheck all
        var checkedCount=0, keys = Object.keys(seats);
        for (var rang=0; rang < keys.length; rang++) {
        	var key = keys[rang];
        	var curSeats = seats[key].seats;
            for (var row=0; row < curSeats.length; row++) {
                for (var col=0; col < curSeats[row].length; col++) {
                    if ( curSeats[row][col].checked ) {
                        checkedCount++;
                    }
                }
            }
            //console.log('new count', newCount, checkedCount);
            // we can have more or less selections after selection change
            // --> more inc availCount
            if (checkedCount === 0) {
            	// nothing selected
                factory.availCount = angular.copy(newCount);
            }
            else if (newCount.val > checkedCount) {
            	//console.log('add delta', newCount, checkedCount)
            	factory.availCount.val = (newCount.val - checkedCount);
            } else {
            	removeAllCheck();
            }
        }
    }
    
	function removeCheck(rang) {
    	// later pass user to this function (for now remove all checked)
        /*var curSeats = seats[rang].seats
        for (var row=0; row < curSeats.length; row++) {
            for (var col=0; col < curSeats[row].length; col++) {
            	curSeats[row][col].checked = false;
            }
        }*/
        keys = Object.keys(seats);
        
        for (var rang=0; rang < keys.length; rang++) {
        	var key = keys[rang];
        	var curSeats = seats[key].seats;
            for (var row=0; row < curSeats.length; row++) {
                for (var col=0; col < curSeats[row].length; col++) {
                    curSeats[row][col].checked = false;
                }
            }
        }
    }
    
    function removeAllCheck() {
     	keys = Object.keys(seats);
    	for (var rang=0; rang < keys.length; rang++) {
        	var key = keys[rang];
        	var curSeats = seats[key].seats;
            for (var row=0; row < curSeats.length; row++) {
                for (var col=0; col < curSeats[row].length; col++) {
                    curSeats[row][col].checked = false;
                }
            }
        }
    }
    
    function selectSeats(selection, count) {
    	// todo:
        // check distance to border, keep the rest as clickable
        // selection = {rang, row, seat}
		//console.log("selection...."+JSON.stringify(selection));
        var row = selection.row,
        	seat = selection.seat;
			
		console.log("row...."+JSON.stringify(row));
		console.log("seat...."+JSON.stringify(seat));
        
        if ( !seat.booked ) {
            //console.log('availCount', factory.availCount);
            if ( factory.availCount.val == 0 ) {
                //console.log('new selection');
                factory.availCount = angular.copy(count);
                removeCheck(); //selection.rang);
            }

            var borderDistance = row.length - row.indexOf(seat),
            	rest = borderDistance > count.val ? 0:  count.val - borderDistance;
                
			if ( factory.availCount.val === count.val) {
                // first click
                var lastIndex = rest > 0 ? row.length: row.indexOf(seat) + count.val;
                for ( var seatIndex = row.indexOf(seat); seatIndex < lastIndex; seatIndex++) {
                    row[seatIndex].checked = true;
                }
                factory.availCount.val = rest; // update available seats
            } 
            else {
                // second click dec. availCounter
                // single change of seats
                /*if ( factory.availCount.val < 0 ) {
                    row[row.indexOf(seat)].checked = false; // remove check
                    factory.availCount.val++;
                }
                else {*/
                if ( !row[row.indexOf(seat)].checked ) {
                	// only if not already checked
                    row[row.indexOf(seat)].checked = true;
                    if ( factory.availCount.val > 0 ) {
                        factory.availCount.val--;
                    }
                 }
                //}
            }
        }
    }
    
	var factory = {
    	map: seats,
        select: selectSeats,
        availCount: {},
        setAvailCount: function(count) {
        	console.log('avail', count);
            checkSelected(count);
        }
    };
    
    return factory
}

function MainCtrl(seats) {
	var vm = this;
    angular.extend(vm, {
    	seats: seats,
        selectionCount: [//[0,1,2,3,4],[
        // object for two-way binding
        {id: 1, val: 1},
        {id: 2, val: 2},
        {id: 3, val: 3},
        {id: 4, val: 4},
		{id: 5, val: 5},
		{id: 6, val: 6},
		{id: 7, val: 7}
        ],
        selectedCount: 0
    });
    
    vm.selectedCount = vm.selectionCount[2];
    seats.setAvailCount(vm.selectedCount);
}