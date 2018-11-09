declare global{
	interface Array<T>{
		/**
		 * Use each array of the element to make an asynchronous call.
		 * Each function will be execute in series (one after another, in order), and it returns the promise value once everything is done
		 * @param asyncCall async function that takes in the element of the array as function input
		 * @constructor
		 */
		Series<X>(asyncCall: (e:T)=> Promise<X>): Promise<X[]>
		
		/**
		 * Use each array of the element to make an asynchronous call.
		 * Each function will be executed concurrently, and it returns once every function is done
		 * @param asyncCall async function that takes in the element of the array as function input
		 * @constructor
		 */
		Parallel<X>(asyncCall : (e:T)=> Promise<X>) : Promise<X[]>
	}
}

interface CC {
	
	IsExtended: boolean;
	ExtendPrimitives():void;
	AssertExtend(): void;
}

class ConCurrent implements CC{
	
	get IsExtended(): boolean{
		return Array.prototype.Series != null;
	};
	
	AssertExtend(): void {
		if(!this.IsExtended) throw new Error("CC needs to be extended");
	}
	
	ExtendPrimitives(): void {
		Array.prototype.Series = async function<X>(asyncCall: (e:any)=> Promise<X>):Promise<X[]>{
			let ret: X[] = [];
			for (let i = 0; i < this.length; i++) {
				const input = this[i];
				let resp: X = await asyncCall(input);
				ret.push(resp);
			}
			return ret;
		};
		
		Array.prototype.Parallel = async function<X>(asyncCall: (e:any)=> Promise<X>): Promise<X[]>{
			let promises: Promise<X>[] = [];
			for (let i = 0; i < this.length; i++) {
				const input = this[i];
				promises.push(asyncCall(input));
			}
			return Promise.all(promises);
		};
	}
	
}


export {
	CC, ConCurrent
}
