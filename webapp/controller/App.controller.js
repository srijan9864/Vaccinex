sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/base/Log",
	"sap/ui/demo/todo/model/formatter"
], function (MessageToast,
	Controller,
	Device,
	Log,
	formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.todo.controller.App.controllers	", {
		formatter: formatter,
		onInit: function () {
			this.getSplitAppObj().setHomeIcon({
				'phone': 'phone-icon.png',
				'tablet': 'tablet-icon.png',
				'icon': 'desktop.ico'
			});
			var oDeviceModel = new sap.ui.model.json.JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
				listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
			});
			this.getView().setModel(oDeviceModel, "device");
			Device.orientation.attachHandler(this.onOrientationChange, this);
			function getDate(n) {
				var date = new Date();
				var today = new Date(date);
				today.setDate(today.getDate() + n);
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				var today = dd + '-' + mm + '-' + yyyy;

				return today;
			}
			var oDate = {
				dates: {
					today: getDate(0),
					today_1: getDate(1),
					today_2: getDate(2),
					today_3: getDate(3),
					today_4: getDate(4),
					today_5: getDate(5),
					today_6: getDate(6)
				}
			};
			var oDateModel = new sap.ui.model.json.JSONModel(oDate);
			this.getView().setModel(oDateModel, 'dates');

			var oModel1 = new sap.ui.model.json.JSONModel();
			var oSettingsModel = new sap.ui.model.json.JSONModel({ navigatedItem: "" });
			this.getView().setModel(oModel1);
			this.getView().setModel(oSettingsModel, 'settings');
			//      1.Get the id of the VizFrame
			var oVizFrame = this.getView().byId("idpiechart");

			if (sap.ui.Device.system.phone){
				oVizFrame.setHeight("400px");
				oVizFrame.setWidth("400px");
			}

			//      2.Create a JSON Model and set the data
			var oModel = new sap.ui.model.json.JSONModel();
			var data = {
				'Vaccine': [{
					"Vaccination": "Dose 1",
					"Count": "156842545"
				}, {
					"Vaccination": "Dose 2",
					"Count": "42281658"
				}, {
					"Vaccination": "Not Vaccinated",
					"Count": "1153518077"
				}]
			};
			oModel.setData(data);
			//  3. Create Viz dataset to feed to the data to the graph
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Vaccination',
					value: "{Vaccination}"
				}],

				measures: [{
					name: 'Count',
					value: '{Count}'
				}],

				data: {
					path: "/Vaccine"
				}
			});

			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel);

			//      4.Set Viz properties with dynamic
			oVizFrame.setVizProperties({
				title: {
					text: "Vaccination Chart India"
				},
				plotArea: {
					colorPalette: d3.scale.category20().range(),
					drawingEffect: "normal"
				}
			});

			var feedSize = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "size",
				'type': "Measure",
				'values': ["Count"]
			}),
				feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "color",
					'type': "Dimension",
					'values': ["Vaccination"]
				});
			oVizFrame.addFeed(feedSize);
			oVizFrame.addFeed(feedColor);
		},

		onExit: function () {
			Device.orientation.detachHandler(this.onOrientationChange, this);
		},

		onOrientationChange: function (mParams) {
			var sMsg = "Orientation now is: " + (mParams.landscape ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, { duration: 5000 });
		},

		onPressNavToDetail: function () {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},

		onPressDetailBack: function () {
			this.getSplitAppObj().backDetail();
		},

		onPressMasterBack: function () {
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},

		onPressModeBtn: function (oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitAppObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
		},

		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oBindingContext = oItem.getBindingContext();
			var oModel = this.getView().getModel();
			var oSettingsModel = this.getView().getModel('settings');
			oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("ProductId", oBindingContext));
		},

		isNavigated: function (sNavigatedItemId, sItemId) {
			return sNavigatedItemId === sItemId;
		},
		onBtnPress: function (oEvent) {
			function getDate(n) {
				var date = new Date();
				var today = new Date(date);
				today.setDate(today.getDate() + n);
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				var today = dd + '-' + mm + '-' + yyyy;

				return today;
			}
			var pincode = this.getView().byId("pincode").getValue();
			var table = this.getView().byId("tableId");
			var table1 = this.getView().byId("tableId1");
			var table2 = this.getView().byId("tableId2");
			var table3 = this.getView().byId("tableId3");
			var table4 = this.getView().byId("tableId4");
			var table5 = this.getView().byId("tableId5");
			var table6 = this.getView().byId("tableId6");
			var vBox = this.getView().byId("Vbox1");
			var checboxes = this.getView().byId("checboxpanel");
			vBox.setVisible(true);
			checboxes.setVisible(true);
			var modeArray = [];
			console.log(pincode);

			for (var i = 0; i < 7; i++) {

				var sPath = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" + pincode + "&date=" + getDate(i);
				var oPinModel = new sap.ui.model.json.JSONModel(sPath);
				modeArray.push(oPinModel);
				sPath = "";
				oPinModel = undefined;
			}
			table.setModel(modeArray[0]);
			table1.setModel(modeArray[1]);
			table2.setModel(modeArray[2]);
			table3.setModel(modeArray[3]);
			table4.setModel(modeArray[4]);
			table5.setModel(modeArray[5]);
			table6.setModel(modeArray[6]);
		},

		onSwitchChange: function (sValue) {
			if (this.getView().byId("switch1").getState()) {
				sap.ui.getCore().applyTheme("sap_fiori_3_dark");
			} else {
				sap.ui.getCore().applyTheme("sap_fiori_3");
			}
		},

		onCheckbox: function(oEvent){
			var filtermodel = new sap.ui.model.json.JSONModel();
			var filterArray = [];
			var oData1 = { filter: filterArray };
			var oFilter;
			var oBinding = this.getView().byId("tableId").getBinding("items");
			var oBinding1 = this.getView().byId("tableId1").getBinding("items");
			var oBinding2 = this.getView().byId("tableId2").getBinding("items");
			var oBinding3 = this.getView().byId("tableId3").getBinding("items");
			var oBinding4 = this.getView().byId("tableId4").getBinding("items");
			var oBinding5 = this.getView().byId("tableId5").getBinding("items");
			var oBinding6 = this.getView().byId("tableId6").getBinding("items");
			oBinding.filter([]);
			oBinding1.filter([]);
			oBinding2.filter([]);
			oBinding3.filter([]);
			oBinding4.filter([]);
			oBinding5.filter([]);
			oBinding6.filter([]);
			if (this.getView().byId("check18").getSelected()){
				oFilter= new sap.ui.model.Filter("min_age_limit", "EQ", "18");
				filterArray.push(oFilter); 
			}
			
			if (this.getView().byId("check45").getSelected()){
				oFilter= new sap.ui.model.Filter("min_age_limit", "EQ", "45");
				filterArray.push(oFilter); 
			}
	
			
			if (this.getView().byId("checkcovaxin").getSelected()){
				oFilter= new sap.ui.model.Filter("vaccine", "EQ", "COVAXIN");
				filterArray.push(oFilter);
			} 
			
			if (this.getView().byId("checkcovishield").getSelected()){
				oFilter= new sap.ui.model.Filter("vaccine", "EQ", "COVISHIELD");
				filterArray.push(oFilter);
			} 
			
			if (this.getView().byId("checksputnik").getSelected()){
				oFilter= new sap.ui.model.Filter("vaccine", "EQ", "SPUTNIK V");
				filterArray.push(oFilter);
			} 
			if (this.getView().byId("checkfree").getSelected()){
				oFilter= new sap.ui.model.Filter("fee_type", "EQ", "Free");
				filterArray.push(oFilter);
			} 
			
			if (this.getView().byId("checkpaid").getSelected()){
				oFilter= new sap.ui.model.Filter("fee_type", "EQ", "Paid");
				filterArray.push(oFilter);
			} 
			oBinding.filter(filterArray);
			oBinding1.filter(filterArray);
			oBinding2.filter(filterArray);
			oBinding3.filter(filterArray);
			oBinding4.filter(filterArray);
			oBinding5.filter(filterArray);
			oBinding6.filter(filterArray);
		}

	});
});
