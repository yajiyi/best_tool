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

bool inject(DWORD pid, const char *dllPath) {
  HANDLE hProcess = OpenProcess(PROCESS_CREATE_THREAD | PROCESS_VM_OPERATION |
                                    PROCESS_VM_WRITE,
                                FALSE, pid);
  if (!hProcess) {
    return false;
  }

  size_t pathLen = strlen(dllPath) + 1;
  LPVOID pRemoteMem = VirtualAllocEx(hProcess, nullptr, pathLen,
                                     MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
  if (!pRemoteMem) {
    CloseHandle(hProcess);
    return false;
  }

  if (!WriteProcessMemory(hProcess, pRemoteMem, dllPath, pathLen, nullptr)) {
    VirtualFreeEx(hProcess, pRemoteMem, 0, MEM_RELEASE);
    CloseHandle(hProcess);
    return false;
  }

  HANDLE hThread = CreateRemoteThread(hProcess, nullptr, 0,
                                      (LPTHREAD_START_ROUTINE)LoadLibraryA,
                                      pRemoteMem, 0, nullptr);
  if (!hThread) {
    VirtualFreeEx(hProcess, pRemoteMem, 0, MEM_RELEASE);
    CloseHandle(hProcess);
    return false;
  }

  WaitForSingleObject(hThread, INFINITE);
  CloseHandle(hThread);
  VirtualFreeEx(hProcess, pRemoteMem, 0, MEM_RELEASE);
  CloseHandle(hProcess);

  return true;
}
int main(int argv, char **args) {
  if (argv != 2) {
    return 1;
  }
  HWND hWnd = GetForegroundWindow();
  DWORD pid;
  GetWindowThreadProcessId(hWnd, &pid);
  const char *dllPath = args[1];
  if (!inject(pid, dllPath)) {
    return 1;
  }
  return 0;
}