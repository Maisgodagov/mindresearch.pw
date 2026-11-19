import { afterEach, describe, expect, it, vi } from "vitest";
const auth = vi.hoisted(() => vi.fn());
vi.mock("../../api", () => ({initializeAuth:auth}));
import { publicRequest } from "./types";
afterEach(()=>{vi.unstubAllGlobals();auth.mockReset();});
describe("public content does not require an account session",()=>{
  it.each(["catalog?q=GAD-7","methods/anxiety-gad7","methods"])("reads %s without refreshing auth",async path=>{
    auth.mockRejectedValue(new Error("Auth unavailable"));
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(JSON.stringify({ok:true}))));
    expect(await publicRequest(path)).toEqual({ok:true});
    expect(auth).not.toHaveBeenCalled();
  });
  it("keeps auth handling for assessment and administrative requests",async()=>{
    auth.mockResolvedValue("token");const fetch=vi.fn().mockResolvedValue(new Response(JSON.stringify({ok:true})));
    vi.stubGlobal("fetch",fetch);
    await publicRequest("assessments/example");
    expect(auth).toHaveBeenCalledOnce();
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer token");
  });
  it("preserves HTTP status so only real missing articles get noindex",async()=>{
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(JSON.stringify({message:"Missing"}),{status:404})));
    await expect(publicRequest("methods/missing")).rejects.toMatchObject({status:404});
  });
});
