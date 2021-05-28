sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/base/Log"
], function (MessageToast, Controller, Device, Log) {
	"use strict";

	return Controller.extend("sap.m.sample.SplitApp.C", {
		onInit: function () {
			this.getSplitAppObj().setHomeIcon({
				'phone': 'phone-icon.png',
				'tablet': 'tablet-icon.png',
				'icon': 'desktop.ico'
			});

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
		onBtnPress : function (oEvent) {
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
			console.log(pincode);
			var sPath = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode="+pincode+"&date="+getDate(0);
			var oPinModel = new sap.ui.model.json.JSONModel(sPath);
			console.log(oPinModel);
			table.setModel(oPinModel);
			table1.setModel(oPinModel);
		},

		available_capacity : function (sValue) {
			console.log(sValue);
		}

	});
});
