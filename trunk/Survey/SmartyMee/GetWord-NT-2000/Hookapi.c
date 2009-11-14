/////////////////////////////////////////////////////////////////////////
//
// hookapi.c
//
// Date   : 04/18/99
//
/////////////////////////////////////////////////////////////////////////

#include <windows.h>
#include "hookapi.h"
#include "public.h"
#include "string.h"

//#pragma comment(lib, "k32lib.lib")

//extern BOOL g_bCanWrite;

/////////////////////////////////////////////////////////////////////////
// Hook Api
/////////////////////////////////////////////////////////////////////////
FARPROC WINAPI NHGetFuncAddress(HINSTANCE hInst, LPCSTR lpMod, LPCSTR lpFunc)
{
	HMODULE hMod;
	FARPROC procFunc;

	if (NULL != lpMod)
	{
		hMod=GetModuleHandle(lpMod);
		procFunc = GetProcAddress(hMod,lpFunc);
	}
	else
	{
		procFunc = GetProcAddress(hInst,lpFunc);

	}
	
	return  procFunc;
}

void MakeJMPCode(LPBYTE lpJMPCode, LPVOID lpCodePoint)
{
	BYTE temp;
	WORD wHiWord = HIWORD(lpCodePoint);
	WORD wLoWord = LOWORD(lpCodePoint);
	WORD wCS;

	_asm						// ����e��ܲšO
	{
		push ax;
		push cs;
		pop  ax;
		mov  wCS, ax;
		pop  ax;
	};
	
	lpJMPCode[0] = 0xea;		// ��J JMP ���O�������X�O

	temp = LOBYTE(wLoWord);		// -------------------------
	lpJMPCode[1] = temp;
	temp = HIBYTE(wLoWord);
	lpJMPCode[2] = temp;		// ��J�a�}�O�b���s�������Ǭ��F
	temp = LOBYTE(wHiWord);		// Point: 0x1234
	lpJMPCode[3] = temp;		// ���s�G 4321
	temp = HIBYTE(wHiWord);
	lpJMPCode[4] = temp;		// -------------------------
	
	temp = LOBYTE(wCS);			// ��J��ܲšO
	lpJMPCode[5] = temp;
	temp = HIBYTE(wCS);
	lpJMPCode[6] = temp;

	return;
}

void HookWin32Api(LPAPIHOOKSTRUCT lpApiHook, int nSysMemStatus)
{
	DWORD  dwReserved;
	DWORD  dwTemp;
	BYTE   bWin32Api[5];

	bWin32Api[0] = 0x00; 

	// ���o�Q�d�I��Ʀa�}�O
	if(lpApiHook->lpWinApiProc == NULL)
	{	
		lpApiHook->lpWinApiProc = (LPVOID)NHGetFuncAddress(lpApiHook->hInst, lpApiHook->lpszApiModuleName,lpApiHook->lpszApiName);
		if (lpApiHook->dwApiOffset != 0)
			lpApiHook->lpWinApiProc = (LPVOID)((DWORD)lpApiHook->lpWinApiProc + lpApiHook->dwApiOffset);
	}
	// ���o���N��Ʀa�}�O
	if(lpApiHook->lpHookApiProc == NULL)
	{
		lpApiHook->lpHookApiProc = (LPVOID)NHGetFuncAddress(lpApiHook->hInst,
			lpApiHook->lpszHookApiModuleName,lpApiHook->lpszHookApiName);
	}
	// �Φ� JMP ���O�O
	if (lpApiHook->HookApiFiveByte[0] == 0x00)
	{
		MakeJMPCode(lpApiHook->HookApiFiveByte, lpApiHook->lpHookApiProc);
	}

	if (!VirtualProtect(lpApiHook->lpWinApiProc, 16, PAGE_READWRITE,
			&dwReserved))
	{
		MessageBox(NULL, "VirtualProtect-READWRITE", NULL, MB_OK);
		return;
	}
	
	if (nSysMemStatus == HOOK_NEED_CHECK)
	{
		memcpy(lpApiHook->lpWinApiProc, (LPVOID)lpApiHook->HookApiFiveByte,BUFFERLEN);
	}
	else
	{
		if (lpApiHook->WinApiFiveByte[0] == 0x00)			// �P�_�O�_�w�g�d�I�O
		{
			// �_�O
			// �ƥ� API ����Y���Ӧr�`�O
			memcpy(lpApiHook->WinApiFiveByte,(LPVOID)lpApiHook->lpWinApiProc,BUFFERLEN);
			// �P�_�O�_�����d�I�O(�Y�P�_�ƥ����Y���Ӧr�`�O�_���Φ���JMP���O)
			if (strncmp(lpApiHook->WinApiFiveByte, lpApiHook->HookApiFiveByte, BUFFERLEN) == 0)
			{
				// ��_�ƥ����r�`�O
				memcpy(lpApiHook->WinApiFiveByte,(LPVOID)lpApiHook->WinApiBakByte,BUFFERLEN);
			}
		}
		else
		{
			// �O�O
			memcpy(bWin32Api,(LPVOID)lpApiHook->lpWinApiProc,BUFFERLEN);
		}

		if (strncmp(bWin32Api, lpApiHook->HookApiFiveByte, BUFFERLEN) != 0)
		{
			// �N JMP ���w��J API ��ƪ��Y�O
			memcpy(lpApiHook->lpWinApiProc, (LPVOID)lpApiHook->HookApiFiveByte,BUFFERLEN);
		}
	}

	if (!VirtualProtect(lpApiHook->lpWinApiProc, 16, dwReserved, &dwTemp))
	{
		MessageBox(NULL, "VirtualProtect-RESTORE", NULL, MB_OK);
		return;
	}
}

void RestoreWin32Api(LPAPIHOOKSTRUCT lpApiHook, int nSysMemStatus)
{
	DWORD dwReserved;
	DWORD dwTemp;

	if (lpApiHook->lpWinApiProc == NULL)
		return;

	if (!VirtualProtect(lpApiHook->lpWinApiProc, 16, PAGE_READWRITE,
			&dwReserved))
	{
		MessageBox(NULL, "VirtualProtect-READWRITE", NULL, MB_OK);
		return;
	}
	memcpy(lpApiHook->lpWinApiProc,(LPVOID)lpApiHook->WinApiFiveByte,BUFFERLEN);
	if (!VirtualProtect(lpApiHook->lpWinApiProc, 16, dwReserved, &dwTemp))
	{
		MessageBox(NULL, "VirtualProtect-RESTORE", NULL, MB_OK);
		return;
	}
}
