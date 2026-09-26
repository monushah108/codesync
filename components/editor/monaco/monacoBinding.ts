let MonacoBindingClass: any = null;

export async function getMonacoBinding() {
  if (!MonacoBindingClass) {
    const mod = await import("y-monaco");
    MonacoBindingClass = mod.MonacoBinding;
  }
  return MonacoBindingClass;
}
