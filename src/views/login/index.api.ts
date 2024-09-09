import http from "@/http";
export const getMachineCode = async () =>
  http.request({
    method: "get",
    url: "/power/machine/code",
  });

export const login = async (data: { encrypted_code: string }) =>
  http.request({
    url: `/power/machine/verify_code?encrypted_code=${data.encrypted_code}`,
  });
