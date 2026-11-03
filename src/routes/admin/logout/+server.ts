import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ cookies }) => {
	cookies.delete('svadba_session', { path: '/' });
	throw redirect(303, '/admin/login');
};

export const POST: RequestHandler = ({ cookies }) => {
	cookies.delete('svadba_session', { path: '/' });
	throw redirect(303, '/admin/login');
};
