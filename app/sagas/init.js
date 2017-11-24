import { AsyncStorage } from 'react-native';
import { call, put, take } from 'redux-saga/effects';
import * as actions from '../actions';
import { setServer } from '../actions/server';
import { restoreToken } from '../actions/login';
import { APP } from '../actions/actionsTypes';
import realm from '../lib/realm';
import RocketChat from '../lib/rocketchat';

const restore = function* restore() {
	try {
		yield take(APP.INIT);
		const token = yield call([AsyncStorage, 'getItem'], 'reactnativemeteor_usertoken');
		if (token) {
			yield put(restoreToken(token));
		}

		const currentServer = yield call([AsyncStorage, 'getItem'], 'currentServer');
		if (currentServer) {
			yield put(setServer(currentServer));
			const tmp = realm.objects('settings');
			yield put(actions.setAllSettings(RocketChat.parseSettings(tmp.slice(0, tmp.length))));
		}
		yield put(actions.appReady({}));
	} catch (e) {
		console.log(e);
	}
};
export default restore;