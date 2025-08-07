/*
Copyright (C) 2025  yajiyi

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Contact: yajiyi114514@gmail.com
*/

#include <windows.h>

HMODULE g_hDll = NULL;
DWORD WINAPI EnableThread(LPVOID param) {
  HWND hWnd = GetForegroundWindow();
  SetWindowDisplayAffinity(hWnd, WDA_EXCLUDEFROMCAPTURE);

  FreeLibraryAndExitThread(g_hDll, 0);
  return 0;
}

BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason, LPVOID) {
  if (ul_reason == DLL_PROCESS_ATTACH) {
    g_hDll = hModule;
    HANDLE hThread =
        CreateThread(nullptr, 0, EnableThread, nullptr, 0, nullptr);
    CloseHandle(hThread);
  }
  return TRUE;
}