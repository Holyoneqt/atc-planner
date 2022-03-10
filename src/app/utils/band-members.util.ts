import { BandMember } from '../models/band-members';

export function getCleanBandMemberClassName(name: BandMember): string {
	if (name === 'Chöbbi') {
		return 'Chobben';
	}
	if (name === 'Fäbe') {
		return 'Fabe'
	}
	return name;
}